import React from "react"
import {
  AppProvider,
  Page,
  Stack,
  Button,
  Modal,
  Form,
  FormLayout,
  TextField,
  TextContainer
} from "@shopify/polaris";


class EmployeeEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.employee.name,
      job_title: this.props.employee.job_title,
      description: this.props.employee.description,
      profile_url: this.props.employee.profile_url,
      save_loading: false,
      save_disabled: true,
      valid_img: false,
      name_error: "",
      description_error: "",
      img_error: "",
      deleting: false,
      delete_loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.goBack = this.goBack.bind(this);
    this.processSubmit = this.processSubmit.bind(this);
    this.checkForErrors = this.checkForErrors.bind(this);
  }

  componentDidMount() {
    this.props.fetchEmployee(this.props.employee.id);
  }

  handleChange(name, value) {
    if (name === "name" && this.state.name_error.length > 0) {
      this.setState({ name_error: "" })
    } else if (name === "description" && this.state.description_error.length > 0) {
      this.setState({ description_error: "" })
    }
    this.setState({ save_disabled: false });
    let state = this.state;
    state[name] = value;
    this.setState({ state });
  }

  goBack() {
    this.props.history.push("/");
  }

  checkForErrors() {
    if (this.state.name.length < 1) {
      this.setState({ name_error: "Name is required" });
      const elmnt = document.getElementById("name-ele");
      elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
      return true;
    } else if (this.state.description.length < 5) {
      const elmnt = document.getElementById("description-ele");
      elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
      this.setState({ description_error: "Description must be at least 5 characters" });
      return true;
    } else if (this.state.valid_img === false) {
      const elmnt = document.getElementById("img-url-ele");
      elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
      this.setState({ img_error: "Valid image url is required" });
      return true;
    } else {
      return false;
    }
  }

  closeModal() {
    this.setState({ deleting: false });
  }

  openModal() {
    this.setState({ deleting: true });
  }

  deleteEmployee() {
    this.closeModal();
    this.setState({ save_loading: true });
    this.setState({ delete_loading: true });
    this.props.deleteEmployee(this.props.employee.id).then(data => this.props.history.push("/"));
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.checkForErrors() === false) {
      this.setState({ save_loading: true });
      this.setState({ delete_loading: true });
      let employeeUpdated = {
        id: this.props.employee.id,
        name: this.state.name,
        job_title: this.state.job_title,
        description: this.state.description,
        profile_url: this.state.profile_url,
      };
      this.props.updateEmployee(employeeUpdated)
        .then(data => this.processSubmit(data));
    }
  }

  processSubmit(data) {
    if ('error' in data) {
      this.setState({ save_loading: false });
      this.setState({ delete_loading: false });
      this.setState({ name_error: data.error });
      const elmnt = document.getElementById("name-ele");
      elmnt.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      this.props.history.push("/")
    }
  }

  render() {
    let name = '';

    if (this.props.employee !== undefined) {
      name = this.props.employee.name;
    }
    
    const {
      deleting,
      save_loading,
      save_disabled,
      delete_loading,
    } = this.state;
    const title = `${name}'s Profile`;
    const delete_question = `Are you sure you want to delete ${name}?`;
    const delete_subtitle = `Doing so will delete their page and all of their pick reviews. This cannot be undone.`
    return (
      <AppProvider>
        <br/><br/>
        <Page
          title={title}
          breadcrumbs={[{ content: "Back", onAction: this.goBack }]}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormLayout>
              <Stack>
                <div>
                  <TextField
                    value={this.state.name}
                    onChange={this.handleChange.bind(this, "name")}
                    label="Name"
                    type="text"
                    id="name-ele"
                    maxLength={24}
                    fullWidth
                    error={this.state.name_error}
                  />
                  <br />
                  <TextField
                    value={this.state.job_title}
                    onChange={this.handleChange.bind(this, "job_title")}
                    label="Job Title"
                    type="text"
                    maxLength={24}
                  />
                  <br />
                  <TextField
                    id="description-ele"
                    value={this.state.description}
                    onChange={this.handleChange.bind(this, "description")}
                    label="Description"
                    multiline={6}
                    maxLength={500}
                    showCharacterCount={true}
                    error={this.state.description_error}
                  />
                  <br />
                  <TextField
                    id="img-url-ele"
                    value={this.state.profile_url}
                    onChange={this.handleChange.bind(this, "profile_url")}
                    label="Profile Image URL"
                    maxLength={300}
                    error={this.state.img_error}
                    helpText={
                      <span>
                        Upload images to Shopify Files (Settings/Files) and
                        paste image's URL here
                      </span>
                    }
                  />
                </div>
                <img
                  src={this.state.profile_url}
                  onLoad={(e) => {
                    if (e.target.src !== "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png") {
                      this.setState({ img_error: "" });
                      this.setState({ valid_img: true })
                    }
                  }}
                  onError={(e) => {
                    this.setState({ valid_img: false });
                    e.target.onerror = null;
                    e.target.src =
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                  style={{ height: "320px", padding: "20px" }}
                />
              </Stack>
              <Stack>
                <Button
                  primary={true}
                  loading={save_loading}
                  disabled={save_disabled}
                  submit
                >
                  Save
                </Button>
                <Button
                  destructive={true}
                  onClick={() => this.openModal()}
                  loading={delete_loading}
                >
                  Delete
                </Button>
              </Stack>
            </FormLayout>
          </Form>
          <Modal
            open={deleting}
            onClose={this.closeModal}
            title={delete_question}
          >
            <Modal.Section>
              <TextContainer>
                <p>
                  {delete_subtitle}
                </p>
              </TextContainer>
              <br/><hr/><br/>
              <Stack>
                <Button onClick={() => this.closeModal()}>Cancel</Button>
                <Button
                  destructive={true}
                  onClick={() => this.deleteEmployee()}
                >
                  Delete
                </Button>
              </Stack>
            </Modal.Section>
          </Modal>
        </Page>
      </AppProvider>
    );
  }
}

export default EmployeeEdit;