import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper";

export default function Signin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false,
  });
  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAuthenticated();
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              didRedirect: true,
              name: "",
              email: "",
              password: "",
              error: "",
            });
          });
        }
      })
      .catch(() => console.log("sign in failed"));
  };
  const performRedirect = () => {
    //FIX
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const loadingMesage = () => {
    if (loading) {
      return (
        <div className="row">
          <div className="col-md-6 offset-sm-3 test-left">
            <div className="alert alert-info">Loading...</div>
          </div>
        </div>
      );
    }
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
  const signInForm = () => (
    <div className="row">
      <div className="col-md-6 offset-sm-3 text-left">
        <form>
          <div className="form-group">
            <label className="text-light">Email</label>
            <input
              className="form-control"
              type="text"
              value={email}
              onChange={handleChange("email")}
            />
          </div>
          <div className="form-group">
            <label className="text-light">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={handleChange("password")}
            />
          </div>
          <button onClick={onSubmit} className="btn-success btn-block">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  return (
    <Base title="Sign in" description="A page for user to sign in!">
      {loadingMesage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
}
