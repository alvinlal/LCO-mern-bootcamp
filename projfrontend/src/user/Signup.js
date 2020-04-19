import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });
  const { name, email, password, error, success } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, success: false, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log("Error in signup"));
  };
  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            Signup successful!,please click <Link to="/signin">Here</Link> to
            signin.
          </div>
        </div>
      </div>
    );
  };
  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };
  const signUpForm = () => (
    <div className="row">
      <div className="col-md-6 offset-sm-3 text-left">
        <form>
          <div className="form-group">
            <label className="text-light">Name</label>
            <input
              className="form-control"
              type="text"
              onChange={handleChange("name")}
              value={name}
            />
          </div>
          <div className="form-group">
            <label className="text-light">Email</label>
            <input
              className="form-control"
              type="text"
              onChange={handleChange("email")}
              value={email}
            />
          </div>
          <div className="form-group">
            <label className="text-light">Password</label>
            <input
              className="form-control"
              type="password"
              onChange={handleChange("password")}
              value={password}
            />
          </div>
          <button className="btn-success btn-block" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <Base title="Sign up" description="A page for user to sign up!">
      {errorMessage()}
      {successMessage()}
      {signUpForm()}
      <p className="text-center text-white">{JSON.stringify(values)}</p>
    </Base>
  );
}
