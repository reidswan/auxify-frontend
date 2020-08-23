import React from "react";
import { connect } from "react-redux";
import { Box, Heading, Form, FormField, Button, TextInput, Text } from "grommet";
import { Next } from "grommet-icons";
import Loader from "./Loader";
import FlexibleContainer from "./FlexibleContainer";
import { login } from "../actions"

class Auth extends React.Component {

  render = () => {
    let icon = this.props.loading ? <Loader size="20px" color="black" /> : <Next />;
    return (
      <FlexibleContainer a11yTitle="Form for logging in">
        <Box
          flex
          direction="row"
          justify="between"
          align="center"
          pad={{
            left: "medium",
            right: "small",
            top: "medium",
            bottom: "small",
          }}
        >
          <Heading level="2" margin="none">
            Log in
          </Heading>
        </Box>
        <Box pad={{ vertical: "small", horizontal: "medium" }}>
          <Form
            onSubmit={({ value }) => this.props.dispatch(login(value.email, value.password))}
          >
            <FormField name="email" htmlfor="email_input" label="Email">
              <TextInput id="email_input" name="email" required />
            </FormField>
            <FormField name="password" htmlfor label="Password">
              <TextInput
                id="password_input"
                name="password"
                required
                type="password"
              />
            </FormField>
            {this.props.error && <Text size="small" color="status-critical">Login failed; please check details and try again</Text>}
            <Box direction="row" justify="end" pad={{ top: "medium" }}>
              <Button reverse primary type="submit" icon={icon} size="medium" label="Log in" disabled={this.props.loading}/>
            </Box>
          </Form>
        </Box>
      </FlexibleContainer>
    );
  };
}

function mapStateToProps(state) {
  return {
    loading: state.processingLogin,
    error: state.loginError
  };
}

export default connect(mapStateToProps)(CreateRoom);
