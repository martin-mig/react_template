
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './service/ProductService';
import { Tag } from 'primereact/tag';

export default function RowExpansionDemo() {
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);

    useEffect(() => {
        ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} width="64px" className="shadow-4" />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getProductSeverity(rowData)}></Tag>;
    };

    const getProductSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const allowExpansion = (rowData) => {
        return rowData.orders.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
              <ul>
                <li>
                  ID: {data.orders[0].id}
                </li>
                <li>
                  Customer: {data.orders[0].customer}
                </li>
                <li>
                  Date: {data.orders[0].date}
                </li>
                <li>
                  Amount: {data.orders[0].amount}
                </li>
                <li>
                  Status: {data.orders[0].status}
                </li>
              </ul>
            </div>
        );
    };

    return (
        <div className="card">
            <DataTable value={products} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
              expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="name" header="Name" sortable />
                <Column header="Image" body={imageBodyTemplate} />
                <Column field="price" header="Price" sortable body={priceBodyTemplate} />
                <Column field="category" header="Category" sortable />
                <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate} />
            </DataTable>
        </div>
    );
}
        