
import React from "react";
import { Link } from "react-router-dom";
import {
  AppProvider,
  Page,
  TextStyle,
  Card,
  ResourceList,
  Button,
  Spinner
} from "@shopify/polaris";


class ProductIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      limitReach: false,
      limitError: "",
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
    if (this.props.employees.length >= 36) {
      this.setState({ limitReach: true });
      this.setState({ limitError: "You have reached your limit of picks" });
    }
  }

  goToNewPick() {
    this.props.history.push("/products/new");
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
    let title = `${name}'s ${shopify_title} review:`;

    return (
      <Link to={`/products/${id}/edit`}>
        <ResourceList.Item
          id={id}
          accessibilityLabel={`details for ${shopify_title} `}
        >
          <div id="div-container">
            <img src={shopify_image_url} style={{ width: "60px" }} />
            <div id="description-list">
              <TextStyle variation="strong">{title}</TextStyle>
              <TextStyle> {review} </TextStyle>
            </div>
          </div>
        </ResourceList.Item>
      </Link>
    );
  }

  render() {
    const { products } = this.props;
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
              items={products}
              renderItem={this.renderProduct}
            ></ResourceList>
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