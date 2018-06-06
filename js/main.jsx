import React from 'react';
import ReactDOM from 'react-dom';
import "es6-promise/auto";
import "isomorphic-fetch";
import ProductComparison from './components/product-comparison';
import Config from './configs/config';
import Error from './components/error';
import Loader from './components/loader';
import { HandleError } from './utils/error';
const { productIdProperty, notComparable } = Config;


export default class ProductList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            features: [],
            products: [],
            productData: {},
            comparableFeatures: [],
            visibleProducts:[],
            visibleProductsIds: [],
            isLoading: true,
            isErrorShown: false
        }
    }

    componentDidMount(){

        const url = 'https://www.zamro.nl/actions/ViewProduct-ProductCompare?SKU=115E19,11545A,115E1A,115576';

        fetch(url)
            .then(HandleError)
            .then(res => {
                res.json().then((res) => {
                    this.setState({isLoading: false});
                    this.processFeaturesList(res.products)
                })

            })
            .catch((error) => {
                this.setState({
                    isErrorShown: true,
                    isLoading: false
                })
            })

    }


    processFeaturesList(products, visibleIds){

        let visibleProductsIds = visibleIds || products.map((prod)=>prod[productIdProperty]);
        let visibleProducts = products.filter((prod) => visibleProductsIds.indexOf(prod[productIdProperty]) > -1);

        /* sort all features for comparison alphabetically */
        let features =  Object.keys(products[0]).sort((a, b)=> {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });

        /* extract comparable features from the list of all features */
        let comparableFeatures = features.filter((item)=>{
            return notComparable.indexOf(item) < 0;
        });

        /* move badges to the beginning of the list */
        comparableFeatures = comparableFeatures.splice(comparableFeatures.indexOf('badges'), 1).concat(comparableFeatures);

        /* generate data structure for building the table */

        let productData = {};
        features.forEach((feat)=>{
            productData[feat] = [];
            visibleProducts.forEach((pr)=>{
                productData[feat].push(pr[feat])
            })
        });

        this.setState( {
            products,
            features,
            comparableFeatures,
            productData,
            visibleProducts,
            visibleProductsIds
        })
    }


    deleteProduct = (id)=>{
        let products = this.state.products.filter(x => x[productIdProperty] !== id);
        let visibleProductsIds = this.state.visibleProductsIds.filter(x => x[productIdProperty] !== id);
        this.setState(this.processFeaturesList(products, visibleProductsIds))
    };


    updateSelection = (e)=>{
        const id = e.target.name;
        let visibleProductsIds = [...this.state.visibleProductsIds];
        if (e.target.checked) {
            visibleProductsIds.push(id);
        } else {
            visibleProductsIds.splice(visibleProductsIds.indexOf(id), 1);
        }

        this.processFeaturesList(this.state.products, visibleProductsIds);
    };

    render() {

        return (

            <div className="container">

                <h1 className="heading heading--primary">Compare products</h1>

                {this.state.isLoading ?
                    <div className="margin--xl">
                        <Loader />
                    </div>
                    :
                    <div className="margin--xl">
                        {this.state.isErrorShown ?
                            <Error />
                            :
                            <ProductComparison
                                features = {this.state.features}
                                products={this.state.products}
                                visibleProducts={this.state.visibleProducts}
                                productData={this.state.productData}
                                comparableFeatures = {this.state.comparableFeatures}
                                updateSelection = {this.updateSelection}
                                deleteProduct = {this.deleteProduct}
                            />
                        }
                    </div>
                }

            </div>
        );
    }
}



ReactDOM.render(<ProductList  />, document.getElementById('js-app'));