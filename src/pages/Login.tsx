import React, { Children } from 'react'
import { runInThisContext } from 'vm';

enum AuthTab {
  LOGIN = "Login",
  REGISTER = "Register"
}

function FormRow(props: {children: React.ReactNode | Array<React.ReactNode>}) {
  return (
    <div className="block w-full mt-2">
      {props.children}
    </div>
  )
}

function FormTextField(props: {label: string}) {
  return (
    <div className="w-full px-4 py-1 flex flex-col">
      <label className="text-md px-6 flex-grow-0 inline-block my-auto">{props.label}</label>
      <input type="text" className="rounded-full cursor-text flex-grow bg-white block mx-4 mt-2 py-2 px-4 text-black"/>
    </div>
  )
}

function FormSubmitButton(props: {text: string}) {
  return (
    <button className="mx-auto bg-green-600 rounded-full block text-xl px-12 py-2 mt-5">{props.text}</button>
  )
}

type LoginData = {
  email?: string,
  password?: string
}

type RegisterData = {
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  passwordConfirm?: string
}

export default class Login extends React.Component<{}, { showing: AuthTab, loginData: LoginData, registerData: RegisterData }> {
  modalHeaderClasses: string = " inline-block uppercase text-3xl flex-1 text-center p-1 py-3 w-full border-b border-transparent border-transition-0_25 hover:border-green-500 ";
  modalHeaderActive: string = " border-b border-white text-white ";
  modalHeaderInactive: string = " text-smokegray-light cursor-pointer ";

  constructor(props: {}) {
    super(props)

    this.state = {
      showing: AuthTab.LOGIN,
      loginData: {},
      registerData: {}
    }
  }

  updateLoginData = (data: LoginData) => {
    let updatedLoginData = { ...this.state.loginData, ...data }
    this.setState({ loginData: updatedLoginData })
  }

  updateRegisterData = (data: RegisterData) => {
    let updatedRegisterData = { ...this.state.registerData, ...data }
    this.setState({ loginData: updatedRegisterData })
  }

  loginRows = () => {
    return [
      <FormRow><FormTextField label="Email"/></FormRow>,
      <FormRow><FormTextField label="Password"/></FormRow>
    ]
  }

  registerRows = () => {
    return [
      <FormRow><FormTextField label="First name"/></FormRow>,
      <FormRow><FormTextField label="Last name"/></FormRow>,
      <FormRow><FormTextField label="Email"/></FormRow>,
      <FormRow><FormTextField label="Password"/></FormRow>,
      <FormRow><FormTextField label="Confirm password"/></FormRow>
    ]
  }

  render() {
    let loginClasses = this.modalHeaderClasses + (this.state.showing === AuthTab.LOGIN ? this.modalHeaderActive : this.modalHeaderInactive);
    let registerClasses = this.modalHeaderClasses + (this.state.showing === AuthTab.REGISTER ? this.modalHeaderActive : this.modalHeaderInactive);

    return (
      <div className="absolute rounded-lg flex flex-col justify-between bg-smokegray" style={{ "top": "20vh", "left": "35vw", "right": "35vw" }}>
        <div className="grid grid-cols-2">
          <div
            onClick={() => this.setState({ showing: AuthTab.LOGIN })}
            className={loginClasses}>
            Login
            </div>
          <div
            onClick={() => this.setState({ showing: AuthTab.REGISTER })}
            className={registerClasses}>
            Register
            </div>
        </div>
        <div className="py-6">
          {this.state.showing === AuthTab.LOGIN ? this.loginRows() : this.registerRows()}
          <FormSubmitButton text={this.state.showing}/>
        </div>
      </div>
    )
  }
}
