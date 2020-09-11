import React from "react";
import { connect } from "react-redux";
import {
  Box,
  Heading,
  Form,
  FormField,
  Button,
  TextInput,
  Text,
  Anchor,
} from "grommet";
import { Next } from "grommet-icons";
import Loader from "./Loader";
import FlexibleContainer from "./FlexibleContainer";
import { login, register } from "../actions";
import theme from "../styles/theme";

const LOGIN_FORM = "login";
const REGISTER_FORM = "register";

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: props.initial || LOGIN_FORM,
    };
  }

  render = () => {
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
            {this.state.showing === LOGIN_FORM ? "Log in" : "Register"}
          </Heading>
        </Box>
        <Box pad={{ vertical: "small", horizontal: "medium" }}>
          {this.state.showing === LOGIN_FORM ? (
            <LoginForm
              {...this.props}
              showRegisterForm={() => this.setState({ showing: REGISTER_FORM })}
            />
          ) : (
            <RegisterForm
              {...this.props}
              showLoginForm={() => this.setState({ showing: LOGIN_FORM })}
            />
          )}
        </Box>
      </FlexibleContainer>
    );
  };
}

const LoginForm = (props) => {
  let icon = props.login.loading ? (
    <Loader size="20px" color="black" />
  ) : (
    <Next color="black" />
  );
  return (
    <Form
      onSubmit={({ value }) =>
        props.dispatch(login(value.email, value.password))
      }
    >
      <FormField name="email" htmlfor="email_input" label="Email">
        <TextInput id="email_input" name="email" required />
      </FormField>
      <FormField name="password" htmlfor="password_input" label="Password">
        <TextInput
          id="password_input"
          name="password"
          required
          type="password"
        />
      </FormField>
      {props.login.error && (
        <Text size="small" color="status-critical">
          Login failed; please check details and try again.
        </Text>
      )}
      <Box direction="row" justify="between" pad={{ top: "medium" }}>
        <Anchor size="small" color="brand" onClick={props.showRegisterForm}>
          Register
        </Anchor>
        <Button
          reverse
          primary
          type="submit"
          icon={icon}
          size="medium"
          label={<Text color="black">Log in</Text>}
          disabled={props.login.loading}
          color={theme.global.colors.brand}
        />
      </Box>
    </Form>
  );
};

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_repeat: "",
      submitted: false,
    };
  }

  checkEmail = (email) => {
    return !!email && !!email.match(EMAIL_REGEX);
  };

  checkPassword = (password) => {
    if (!password) return false;

    if (password.length >= 15) return true;

    if (password.length >= 8) {
      let chars = Array.from(password);

      return (
        chars.some((a) => a.match(/[a-zA-Z]/)) &&
        chars.some((a) => !a.match(/[a-zA-Z]/))
      );
    }

    return false;
  };

  anyEmpty = () => {
    return Object.keys(this.state)
      .filter((i) => i !== "submitted")
      .some((i) => !this.state[i]);
  };

  validateState = (submitted) => {
    let validations = {};

    if (submitted) {
      for (let key of Object.keys(this.state)) {
        if (key !== "submitted" && !this.state[key]) {
          validations[key] = "Field may not be empty";
        }
      }
    }

    if (!!this.state.password) {
      if (this.state.password !== this.state.password_repeat) {
        validations.password_repeat = "Passwords do not match";
      }
      if (!this.checkPassword(this.state.password)) {
        validations.password =
          "Password must be longer than 8 chars and contain an alphabetic and a non-alphabetic character";
      }
    }

    if (!!this.state.email) {
      if (!this.checkEmail(this.state.email)) {
        validations.email = "Email address invalid";
      }
    }
    return validations;
  };

  registrationData = () => {
    let stateClone = Object.assign({}, this.state);
    delete stateClone["submitted"];
    delete stateClone["password_repeat"];
    return stateClone;
  };

  render() {
    let icon = this.props.register.loading ? (
      <Loader size="20px" color="black" />
    ) : (
      <Next color="black" />
    );

    let errors = this.validateState(this.state.submitted);
    let errorsIsEmpty = Object.keys(errors).length === 0;
    let anyFieldEmpty = this.anyEmpty();
    let errorMessage = "";
    let error = this.props.register.error;
    if (!!error && !!error.response && !!error.response.data) {
      errorMessage =
        error.response.data.detail ||
        "Registration failed; please check details and try again.";
    }

    return (
      <Form
        onSubmit={() => {
          this.setState({ submitted: true });
          this.props.dispatch(register(this.registrationData()));
        }}
        errors={errors}
      >
        <FormField
          name="first_name"
          htmlfor="first_name_input"
          label="First name"
        >
          <TextInput
            id="first_name_input"
            name="first_name"
            required
            value={this.state.first_name}
            onChange={(e) =>
              this.setState({
                first_name: e.target.value,
              })
            }
          />
        </FormField>
        <FormField name="last_name" htmlfor="last_name_input" label="Last name">
          <TextInput
            id="last_name_input"
            name="last_name"
            required
            value={this.state.last_name}
            onChange={(e) =>
              this.setState({
                last_name: e.target.value,
              })
            }
          />
        </FormField>
        <FormField name="email" htmlfor="email_input" label="Email">
          <TextInput
            id="email_input"
            name="email"
            required
            value={this.state.email}
            onChange={(e) =>
              this.setState({
                email: e.target.value,
              })
            }
          />
        </FormField>
        <FormField name="password" htmlfor="password_input" label="Password">
          <TextInput
            id="password_input"
            name="password"
            required
            type="password"
            value={this.state.password}
            onChange={(e) =>
              this.setState({
                password: e.target.value,
              })
            }
          />
        </FormField>
        <FormField
          name="password_repeat"
          htmlfor="password_repeat_input"
          label="Confirm password"
        >
          <TextInput
            id="password_repeat_input"
            name="password_repeat"
            required
            type="password"
            value={this.state.password_repeat}
            onChange={(e) =>
              this.setState({
                password_repeat: e.target.value,
              })
            }
          />
        </FormField>
        {!!this.props.register.error && (
          <Text size="small" color="status-critical">
            {errorMessage}
          </Text>
        )}
        <Box direction="row" justify="between" pad={{ top: "medium" }}>
          <Anchor size="small" color="brand" onClick={this.props.showLoginForm}>
            Log in
          </Anchor>
          <Button
            reverse
            primary
            type="submit"
            icon={icon}
            size="medium"
            label={<Text color="black">Register</Text>}
            disabled={
              this.props.register.loading || anyFieldEmpty || !errorsIsEmpty
            }
            color={theme.global.colors.brand}
          />
        </Box>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
    register: state.register,
  };
}

export default connect(mapStateToProps)(Auth);
