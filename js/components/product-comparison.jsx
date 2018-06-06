import React from 'react';
import Config from '../configs/config';

const { productIdProperty } = Config;


export default class ProductList extends React.Component {

    isProductSelected = (id)=>{
        return this.props.visibleProducts.some(prod => prod[productIdProperty] == id)
    };

    processBadge(item){

        return item.split('|').map((img, i)=>{
            return(<img className="product__badge" key={i} src={img} />)
        })
    }


    render() {

        let {productData, comparableFeatures} = this.props;

        let comparison = comparableFeatures.map((feat)=> {

            let dataRow = productData[feat];

            let areValuesSame = dataRow.every(elem=> {
                return dataRow[0] == elem;
            });

            return (
                <tr key={feat} className={'comparison__row ' + (areValuesSame ? '' : 'comparison__row--highlighted')}>
                    <td className="product__feature comparison__cell">{feat.charAt(0).toUpperCase() + feat.slice(1)}</td>

                    {productData[feat].map((item, i)=> {
                        return (
                            <td className="comparison__cell" key={i}>
                                {feat == 'badges' ?
                                    this.processBadge(item)
                                    : item
                                }
                            </td>)
                    })}
                </tr>
            )
        });

        let productHeaders = this.props.visibleProducts.map((product, ind)=>{
            return(
                <td className="comparison__cell" key={product.name}>
                    <div className="product__header">
                        <span className="fas fa-trash product__delete" onClick={this.props.deleteProduct.bind(this, product[productIdProperty])}></span>
                        <img className="product__image" key={ind} src={product.productImage} />
                        <div className="product__name">{product.name}</div>
                        <div className="product__price">{product.salePrice}</div>
                        <div className="product__amount">per {product.uom}</div>
                    </div>
                </td>
            )
        });



        let productSelection = this.props.products.map((product)=>{
            return(
                <label className="comparison__option" key={product[productIdProperty]}>
                    <input className="comparison__checkbox" type="checkbox"
                           name={product[productIdProperty]}
                           checked={this.isProductSelected(product[productIdProperty])}
                           onChange={this.props.updateSelection} />
                    <div>
                        {product.name}
                    </div>
                </label>
            )
        });

        return (
            <div className="comparison">
                <table className={'comparison__table comparison__table--' + (this.props.visibleProducts.length + 1)}>
                    <thead>
                    <tr className="comparison__row">
                        <td className="comparison__cell">
                            {productSelection}
                        </td>
                        {productHeaders}
                    </tr>
                    </thead>
                    <tbody>
                        {comparison}
                    </tbody>
                </table>

            </div>
        );
    }
}

