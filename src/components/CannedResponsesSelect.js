import React from "react";
import { connect } from "react-redux";
import { Actions, withTheme } from "@twilio/flex-ui";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class CannedResponsesSelect extends React.Component {
  constructor(props) {
    super();
    this.state = {
      response: "",
      messages: props.messages,
    };
    this.props = props;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    Actions.invokeAction("SendMessage", {
      channelSid: this.props.channelSid,
      body: event.target.value,
    });
  }

  render() {
    return (
      <FormControl style={{ marginBottom: "20px" }}>
        <InputLabel style={{ paddingLeft: "5px" }} htmlFor="response">
          Canned Responses
        </InputLabel>
        <Select
          value={this.state.response}
          onChange={this.handleChange}
          name="response"
        >
          <MenuItem value="Ich wünsche Ihnen einen schönen Tag!">
            Verabschiedung
          </MenuItem>
          <MenuItem value="Kann ich noch etwas für Sie tun?">
            Weitere Fragen?
          </MenuItem>
          <MenuItem value="Sorry to hear that">
            Sorry to hear
          </MenuItem>
          <MenuItem value="Have a nice day!">
            Have a nice day
          </MenuItem>
          <MenuItem value="To add a payment method please go to your Account -> Billing -> Payment methods and click 'Add payment' method button.">
            Add payment method
          </MenuItem>
        </Select>
      </FormControl>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentTask = false;
  state.flex.worker.tasks.forEach((task) => {
    if (ownProps.channelSid === task.attributes.channelSid) {
      currentTask = task;
    }
  });

  return {
    state,
    currentTask,
  };
};

export default connect(mapStateToProps)(withTheme(CannedResponsesSelect));
