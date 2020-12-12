import React, { Component } from "react";
import {
  AppProvider,
  Banner,
  Page,
  Stack,
  RadioButton,
  Button,
  Card,
  TextField,
  TextStyle,
  List,
  Icon
} from "@shopify/polaris";

class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffColor: "positive",
      picksColor: "positive",
      loaded: false,
    };
    this.checkTotalEmployees = this.checkTotalEmployees.bind(this);
    this.checkTotalProducts = this.checkTotalProducts.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(prevProps.products, this.props.products);
      if (prevProps.employees !== this.props.employees) {
          this.checkTotalEmployees()
      } else if (prevProps.products !== this.props.products){
          this.checkTotalProducts()
      }
  }

  componentDidMount() {
    this.props.fetchEmployees().then((data) => this.checkTotalEmployees());
    this.props.fetchProducts().then((data) => this.checkTotalProducts());
  }

  checkTotalEmployees(){
    if (Object.keys(this.props.employees).length > 0){
      this.setState({ staffColor: "positive" });
    } else {
      this.setState({ staffColor: "negative" });
    }
  }

  checkTotalProducts(){
    if (Object.keys(this.props.products).length > 0){
      this.setState({ picksColor: "positive" });
    } else {
      this.setState({ picksColor: "negative" });
    }
    this.setState({ loaded: true });
  }

  pageCreatedAlert(){
    console.log(this.state.loaded===true, (this.state.staffColor==="negative" || this.state.picksColor==="negative"));
    if (this.state.loaded===true && (this.state.staffColor==="negative" || this.state.picksColor==="negative")){
      return <>
      <AppProvider>
         <Page>
           <br/>
           <Card sectioned title="Setup">
               <TextStyle variation="strong">To setup the app, follow these steps:</TextStyle>
               <br/>
               <div className="tabbed">
                 <TextStyle variation={this.state.staffColor}>1. Add a staff member in the Staff tab. <span className="italics">Note: A staff's profile requires an image url, so beforehand upload a picture to Shopify Files (Settings/Files) and copy its url. </span></TextStyle><br/>
                 <TextStyle variation={this.state.picksColor}>2. Add a pick in the Picks tab.</TextStyle>
               </div>
           </Card>
         </Page>
       </AppProvider>
      </>;
      // return 
      // <>
      //   <AppProvider>
      //     <Page>
      //       <Card sectioned title="Setup">
      //           <TextStyle variation="strong">To setup the app, follow these steps:</TextStyle>
      //           <br/>
      //           <div className="tabbed">
      //             <TextStyle variation={this.state.staffColor}>1. Add a staff member in the Staff tab. <span className="italics">Note: A staff's profile requires an image url, so beforehand upload a picture to Shopify Files (Settings/Files) and copy its url. </span></TextStyle><br/>
      //             <TextStyle variation={this.state.picksColor}>2. Add a pick in the Picks tab.</TextStyle>
      //           </div>
      //       </Card>
      //     </Page>
      //   </AppProvider>
      // </>;
    } else {
      return <></>;
    }  
  }


  render() {
    
    return (<>
      {this.pageCreatedAlert()}
      </>
    );
  }
}

export default Setup;
