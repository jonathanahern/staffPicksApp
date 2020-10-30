import React from "react"
import {Link} from "react-router-dom"
import { AppProvider , Page , TextStyle , Card , ResourceList, Button, Spinner }
from '@shopify/polaris' ;


class EmployeeIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      limitReach: false,
      limitError: "",
    };
    this.checkTotal = this.checkTotal.bind(this);
    this.goToNewStaff = this.goToNewStaff.bind(this);
  }

  componentDidMount() {
    this.props.fetchEmployees().then((data) => this.checkTotal());
  }

  checkTotal() {
    this.setState({ loaded: true });
    if (this.props.employees.length >= 12) {
      this.setState({ limitReach: true });
      this.setState({ limitError: "You have reached your limit of staff" });
    }
  }

  goToNewStaff(){
    this.props.history.push("/employee/new");
  }

  renderStaff(staff) {
    const { id, name, job_title, description, profile_url } = staff;
    let title = null;
    let descriptionEdit = description;
    if (description.length > 340) {
      descriptionEdit = description.substr(0, 340) + "...";
    }
    if (job_title.length > 0) {
      title = ` - ${job_title}`;
    } else {
      title = ``;
    }

    return (
      <Link to={`/employees/${id}/edit`}>
        <ResourceList.Item
          id={id}
          // url={'/employee/edit'}
          accessibilityLabel={`details for ${name} `}
        >
          <div id="div-container">
            <img src={profile_url} style={{ width: "60px" }} />
            <div id="description-list">
              <TextStyle variation="strong">
                {" "}
                {name}
                <span id="job-title-list">{title}</span>{" "}
              </TextStyle>
              <TextStyle> {descriptionEdit} </TextStyle>
            </div>
          </div>
        </ResourceList.Item>
      </Link>
    );
  }

  render() {
    const { employees } = this.props;
    const { limitError, limitReach } = this.state;

    let noStaff = "";
    if (this.state.loaded && this.props.employees.length > 0) {
      noStaff = <TextStyle></TextStyle>;
    } else if (this.state.loaded && this.props.employees.length === 0) {
      noStaff = (
        <>
          <TextStyle variation="subdued">
            You do not have any staff entered currently. Add staff before
            entering picks.
          </TextStyle>{" "}
          <br /> <br />
        </>
      );
    } else if (this.state.loaded === false && this.props.employees.length < 1) {
      noStaff = (
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
              defaultItemSingular: "staff",
              defaultItemPlural: "staff",
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
        <Page title="Staff">
          {noStaff}
          <Card>
            <ResourceList
              showHeader
              items={employees}
              renderItem={this.renderStaff}
            ></ResourceList>
          </Card>
          <br />

          <Button
            disabled={limitReach}
            onClick={() => this.goToNewStaff()}
            primary
          >
            Add Staff
          </Button>
          <br />
          <TextStyle variation="subdued">{limitError}</TextStyle>
          <br />
        </Page>
      </AppProvider>
    );
  }
}

export default EmployeeIndex;