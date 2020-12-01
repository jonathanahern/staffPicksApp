
import React from "react";
import { Link } from "react-router-dom";
import {
  AppProvider,
  Page,
  TextStyle,
  Card,
  ResourceList,
  Button,
  Pagination,
  Spinner,
  Stack
} from "@shopify/polaris";


class ProductIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      limitReach: false,
      limitError: "",
      pageTotal: 0,
      currentPage: 1,
    };
    this.renderProduct = this.renderProduct.bind(this);
    this.checkTotal = this.checkTotal.bind(this);
    this.goToNewStaff = this.goToNewPick.bind(this);
  }

  componentDidMount() {
    this.props.fetchEmployees();
    this.props.fetchProducts().then((data) => this.checkTotal());
  }

  checkTotal() {
    this.setState({ loaded: true });
    var pageTotal = Math.ceil(this.props.products.length / 15);
    this.setState({ pageTotal: pageTotal });

    if (this.props.products.length >= 100) {
      this.setState({ limitReach: true });
      this.setState({ limitError: "You have reached your limit of picks" });
    }
  }

  goToNewPick() {
    this.props.history.push("/products/new");
  }

  nextPage(){
    if (this.state.currentPage<this.state.pageTotal){
      var newCurrent = this.state.currentPage + 1;
      this.setState({ currentPage: newCurrent });
    }
  }

  prevPage(){
    if (this.state.currentPage>1){
      var newCurrent = this.state.currentPage - 1;
      this.setState({ currentPage: newCurrent });
    }
  }

  pageCount(){
    if (this.state.pageTotal > 1){
      return(
            <div className="pagination-bottom">
              <Stack>
                <div id="pagination-numbering">
                  <TextStyle  variation="subdued">Page {this.state.currentPage} of {this.state.pageTotal}</TextStyle>
                </div>
                <Pagination
                    hasPrevious
                    onPrevious={() => {
                      this.prevPage();
                    }}
                    hasNext
                    onNext={() => {
                      this.nextPage();
                    }}
                  />
              </Stack>
            </div>
      );
    } else {
      return("");
    }
  }

  renderProduct(product) {
    const {
      id,
      shopify_title,
      shopify_image_url,
      review,
      employee_id,
    } = product;
    let name = "Employee";
    const { employees } = this.props;
    if (Object.keys(employees).length > 0 && this.props.entities[0][employee_id] !== undefined) {
      name = this.props.entities[0][employee_id].name;
    }
    let title = `${shopify_title} pick by ${name}`;

    return (
      <ResourceList.Item
          id={id}
          accessibilityLabel={`details for ${shopify_title} `}
        >
        <Link to={`/products/${id}/edit`}>
          <div id="div-container">
            <img src={shopify_image_url} style={{ width: "60px" }} />
            <div id="description-list">
              <TextStyle variation="strong">{title}</TextStyle>
              <TextStyle> {review} </TextStyle>
            </div>
          </div>
          </Link>
        </ResourceList.Item>
    );
  }

  render() {
    const { products } = this.props;
    products.sort((a, b) => (a.shopify_title > b.shopify_title) ? 1 : -1)
    const indexi = [ [0,15], [15,30], [30,45], [45,60], [60,75], [75,90], [90,105] ]
    const productsPortion = products.slice(indexi[this.state.currentPage-1][0],indexi[this.state.currentPage-1][1]);
    const { limitError, limitReach } = this.state;

    let noProducts = "";
    if (this.state.loaded && this.props.products.length > 0) {
      noProducts = <TextStyle></TextStyle>;
    } else if (this.state.loaded && this.props.products.length === 0) {
      noProducts = (
        <>
          <TextStyle variation="subdued">
            You do not have any picks entered currently.
          </TextStyle>{" "}
          <br /> <br />
        </>
      );
    } else if (this.state.loaded === false && this.props.products.length < 1) {
      noProducts = (
        <>
          <Spinner
            accessibilityLabel="Spinner example"
            size="large"
            color="teal"
          />
          <br />
          <br />
        </>
      );
    }

    return (
      <AppProvider
        i18n={{
          Polaris: {
            ResourceList: {
              sortingLabel: "Sort by",
              defaultItemSingular: "pick",
              defaultItemPlural: "picks",
              showing: "Showing {itemsCount} {resource}",
              Item: {
                viewItem: "View details for {itemName}",
              },
            },
            Common: {
              checkbox: "checkbox",
            },
          },
        }}
      >
        <br />
        <br />
        <Page title="Picks">
          {noProducts}
          <Card>
            <ResourceList
              showHeader
              items={productsPortion}
              renderItem={this.renderProduct}
            ></ResourceList>
            {this.pageCount()}
          </Card>
          <br />

          <Button
            disabled={limitReach}
            onClick={() => this.goToNewPick()}
            primary
          >
            Add New Pick
          </Button>
          <br />
          <TextStyle variation="subdued">{limitError}</TextStyle>
          <br />
        </Page>
      </AppProvider>
    );
  }
}

export default ProductIndex;