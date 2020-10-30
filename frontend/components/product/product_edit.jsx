import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  AppProvider,
  Page,
  Stack,
  Button,
  Form,
  FormLayout,
  Card,
  TextField,
  DisplayText,
  TextStyle,
  Select,
  Modal
} from "@shopify/polaris";

import {
  Provider as AppBridgeProvider,
  ResourcePicker,
} from "@shopify/app-bridge-react";


class ProductNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      original_id: this.props.product.shopify_product_id,
      shopify_title: this.props.product.shopify_title,
      shopify_image_url: this.props.product.shopify_image_url,
      shopify_product_id: this.props.product.shopify_product_id,
      shopify_handle: this.props.product.shopify_handle,
      review: this.props.product.review,
      employee_id: this.props.product.employee_id,
      loading: false,
      pickerOpen: false,
      selectedEmployee: "",
      apiKey: this.props.data.dataset.apiKey,
      domain_name: this.props.data.dataset.shopOrigin,
      product_error: "",
      review_error: "",
      employee_error: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openPicker = this.openPicker.bind(this);
    this.closePicker = this.closePicker.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.deletePick = this.deletePick.bind(this);
  }

  checkForErrors() {

    if (this.state.shopify_title.length < 1) {
      this.setState({ product_error: "Select a product" });
      const elmnt = document.getElementById("product-ele");
      elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
      return true;
    } else if (this.state.review.length < 5) {
      const elmnt = document.getElementById("review-ele");
      elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
      this.setState({
        review_error: "Review must be at least 5 characters",
      });
      return true;
    } else if (this.state.selectedEmployee.length < 1 && this.state.employee_id === "") {
      const elmnt = document.getElementById("employee-ele");
      elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
      this.setState({ employee_error: "Staff selection is required" });
      return true;
    } else {
      return false;
    }
  }

  closePicker() {
    this.setState({ pickerOpen: false });
  }

  openPicker() {
    this.setState({ pickerOpen: true });
  }

  componentDidMount() {
    this.props.fetchEmployees();
    this.props.fetchProducts();
  }

  goBack() {
    this.props.history.push("/picks");
  }

  closeModal() {
    this.setState({ deleting: false });
  }

  openModal() {
    this.setState({ deleting: true });
  }

  handleSelection(selection) {
    this.closePicker();
    this.setState({ product_error: "" });
    let idArr = selection.selection[0].id.split("Product/");
    let id = parseInt(idArr[idArr.length - 1]);
    const imageUrl = selection.selection[0].images[0].originalSrc;
    const title = selection.selection[0].title;
    const handle = selection.selection[0].handle;
    const found = this.props.products.find(
      (element) =>
        (element.shopify_product_id === id && element.shopify_product_id !== this.state.original_id)
    );
    if (found) {
      this.setState({ product_error: `${title} has already been reviewed` });
    } else {
      this.setState({
        shopify_title: title,
        shopify_image_url: imageUrl,
        shopify_product_id: id,
        shopify_handle: handle,
      });
    }
  }

  handleSubmit() {
    if (this.checkForErrors() === false){
      this.setState({ loading: true });
      let product = {
        id: this.props.product.id,
        shopify_title: this.state.shopify_title,
        shopify_image_url: this.state.shopify_image_url,
        shopify_product_id: this.state.shopify_product_id,
        shopify_handle: this.state.shopify_handle,
        review: this.state.review,
        employee_id: this.state.employee_id,
      };
      this.props.updateProduct(product)
        .then((data) => this.props.history.push("/picks"));
    }
  }

  handleChange(name, value) {
    let state = this.state;
    state[name] = value;
    this.setState({ state });
  }

  deletePick() {
    this.props
      .deleteProduct(this.props.product.id)
      .then((data) => this.props.history.push("/picks"));
  }

  handleSelectChange(e) {
    let arr = e.split("&");
    this.setState({ selectedEmployee: e });
    this.setState({ employee_id: parseInt(arr[1]) });
  }

  render() {
    const { loading } = this.state;
    const config = {
      apiKey: this.state.apiKey,
      shopOrigin: this.state.domain_name,
    };
    const { deleting } = this.state;
    const delete_question = `Are you sure you want to delete this pick?`;
    let productInfo = "";
    if (this.state.product_error.length > 0) {
      productInfo = "";
    } else if (this.state.shopify_title.length < 1) {
      productInfo = <p>No product selected</p>;
    } else {
      productInfo = (
        <Stack vertical>
          <TextStyle variation="strong">{this.state.shopify_title}</TextStyle>
          <img src={this.state.shopify_image_url} alt="" height="100px" />
        </Stack>
      );
    }

    let options = [];
    let selectorVal = "";
    if (this.props.employees.length > 0) {
      this.props.employees.forEach((employee) => {
        let val = `${employee.name}&${employee.id}`;
        let newObj = { label: employee.name, value: val };
        options.push(newObj);
        if (employee.id === this.state.employee_id) {
          selectorVal = val;
        }
      });

    }
    return (
      <>
        <AppProvider>
          <AppBridgeProvider config={config}>
            <Page>
              <br />
              <br />
              <Link to="/picks">
                <p id="back-link">
                  <svg height="20" width="20">
                    <path
                      d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414L8.414 10l4.293 4.293A.999.999 0 0 1 12 16"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  Back
                </p>
              </Link>
              <br />
              <DisplayText size="large" element="h1">
                Edit Pick
              </DisplayText>
              <br />
              <Form onSubmit={this.handleSubmit}>
                <FormLayout>
                  <Card
                    title="Edit Product"
                    sectioned
                    primaryFooterAction={{
                      content: "Find Product",
                      onAction: this.openPicker,
                    }}
                  >
                    {productInfo}
                    <div id="product-ele"></div>
                    <TextStyle variation="negative">
                      {this.state.product_error}
                    </TextStyle>
                  </Card>
                  <Card title="Edit Staff Member" sectioned>
                    <Select
                      id="employee-ele"
                      placeholder={"Select a staff member"}
                      options={options}
                      onChange={this.handleSelectChange}
                      value={selectorVal}
                      error={this.state.employee_error}
                    />
                  </Card>
                  <Card title="Edit Review" sectioned>
                    <TextField
                      id="review-ele"
                      value={this.state.review}
                      onChange={this.handleChange.bind(this, "review")}
                      multiline={true}
                      rows={7}
                      maxLength={400}
                      showCharacterCount={true}
                      error={this.state.review_error}
                    />
                  </Card>
                  <Stack distribution="trailing">
                    <Button
                      loading={loading}
                      destructive
                      onClick={() => this.openModal()}
                    >
                      Delete
                    </Button>
                    <Button
                      loading={loading}
                      primary
                      onClick={() => this.handleSubmit()}
                    >
                      Save
                    </Button>
                  </Stack>
                </FormLayout>
              </Form>
            </Page>
            <ResourcePicker
              resourceType="Product"
              open={this.state.pickerOpen}
              showVariants={false}
              allowMultiple={false}
              onSelection={this.handleSelection}
              onCancel={this.closePicker}
            />
            <br />
            <br />
          </AppBridgeProvider>
        </AppProvider>
        <AppProvider>
          <Modal
            open={deleting}
            onClose={this.closeModal}
            title={delete_question}
          >
            <Modal.Section>
              <Stack>
                <Button onClick={() => this.closeModal()}>Cancel</Button>
                <Button destructive={true} onClick={() => this.deletePick()}>
                  Delete
                </Button>
              </Stack>
            </Modal.Section>
          </Modal>
        </AppProvider>
      </>
    );
  }
}
export default ProductNew;
