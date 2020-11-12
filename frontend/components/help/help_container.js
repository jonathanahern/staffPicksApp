import { connect } from "react-redux";
import { sendEmail } from "../../actions/help_actions";
import Help from "./help";

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  sendEmail: (data) => dispatch(sendEmail(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Help);
