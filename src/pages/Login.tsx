import React from 'react'

enum AuthTab {
  LOGIN = "Login",
  REGISTER = "Register"
}

export default class Login extends React.Component<{},{showing: AuthTab}> {
  modalHeaderClasses: string = " inline-block uppercase text-3xl flex-1 text-center p-1 py-2 w-full border-b border-transparent border-transition-0_25 hover:border-green-500 ";
  modalHeaderActive: string = " border-b border-white text-white ";
  modalHeaderInactive: string = " text-smokegray-light cursor-pointer ";

  constructor(props: {}) {
    super(props)

    this.state = {
      showing: AuthTab.LOGIN
    }
  }

  render() {
    let loginClasses = this.modalHeaderClasses + (this.state.showing === AuthTab.LOGIN ? this.modalHeaderActive : this.modalHeaderInactive);
    let registerClasses = this.modalHeaderClasses + (this.state.showing === AuthTab.REGISTER ? this.modalHeaderActive : this.modalHeaderInactive);
    
    return (
      <div className="absolute rounded-lg flex flex-col justify-between bg-smokegray" style={{"top": "20vh", "left": "35vw", "right": "35vw"}}>
          <div className="grid grid-cols-2">
            <div
              onClick = {() => this.setState({showing: AuthTab.LOGIN})} 
              className={loginClasses}>
                Login
            </div>
            <div
              onClick = {() => this.setState({showing: AuthTab.REGISTER})}
              className={registerClasses}>
                Register
            </div>
          </div>
          <div>
            Fill the space pls
          </div>
      </div>
    )  
  }
}
