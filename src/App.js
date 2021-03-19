import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

var ENDPOINT = "http://15.206.227.32:8080/api/dandi/user"

class App extends React.Component {

    state = {
        name: '',
        age: '',
        phone: '',
        email: '',
        password: '',
        gender: '',
        city: '',
        countryCode: 'IN',
        countryName: '',
        zipcode: '',
        contactName: '',
        contactNumber: '',
        group: '',
        loading: false,
        errorData: null,
        successData: null
    }

    constructor(props) {
        super(props);
        const year = (new Date()).getFullYear();
        this.years = Array.from(new Array(50), (val, index) => year - 10 - index);
    }

    componentDidMount = () => {
        this.getGeoInfo()
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            errorData: null,
            successData: null
        });
    }

    selectCountry(val) {
        CountryRegionData.forEach((value, _) => {
            if (val === value[1]) {
                this.setState({ countryCode: value[1], countryName: value[0] });
            }
        })
    }

    selectRegion(value) {
        this.setState({ region: value });
    }


    getGeoInfo = () => {
        axios.get('https://ipapi.co/json/').then((response) => {
            let data = response.data;
            this.setState({
                countryName: data.country_name,
                countryCode: data.country
            });
        }).catch((error) => {
            console.log(error);
        });
    };

    handleSubmit = () => {

        let data = {
            name: this.state.name,
            age: this.state.age,
            phone: this.state.phone,
            email: this.state.email,
            password: this.state.password,
            gender: this.state.gender,
            city: this.state.city,
            country: this.state.countryName,
            zipcode: this.state.zipcode,
            contactName: this.state.contactName,
            contactNumber: this.state.contactNumber,
            group: this.state.group
        }

        this.setState({
            loading: true
        })

        axios.post(ENDPOINT, data).then((res) => {
            this.setState({
                loading: false,
                successData: res["data"]
            })
        }).catch((err) => {
            this.setState({
                loading: false,
                errorData: err.response.data['errors']
            })
        })
    }

    render = () => {

        return (
            <div className="container padding-top">
                <div className="row justify-content-center align-items-center">
                    <div className="col-12 col-md-8 align-self-center pb-3 pt-3">
                        <div className="card">
                            <div className="card-header text-center">
                                <h2>User Registration</h2>
                            </div>
                            <div className="card-body">
                                {this.state.errorData !== null && (
                                    this.state.errorData.map((v, i) => {
                                        return (<div class="alert alert-danger" role="alert">
                                            {v['message']}
                                        </div>)
                                    })
                                )}
                                {this.state.successData !== null && (
                                    <div class="alert alert-success" role="alert">
                                    {this.state.successData['status']}
                                  </div>
                                )}
                                <div className="form-floating mb-3">
                                    <input type="text" name="name" value={this.state.name} onChange={this.handleInputChange} className="form-control" placeholder="Name" />
                                    <label>Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <select className="form-select" id="floatingSelectGrid" name="age" onChange={this.handleInputChange} value={this.state.age}>
                                        <option value={''}>Select Year</option>
                                        {
                                            this.years.map((year, index) => {
                                                return <option key={`year${index}`} value={year}>{year}</option>
                                            })
                                        }
                                    </select>
                                    <label>Year of Birth</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <select className="form-select" id="floatingSelectGrid" name="gender" onChange={this.handleInputChange} value={this.state.gender}>
                                        <option value={''}>Select Gender</option>
                                        <option value={'M'}>Male</option>
                                        <option value={'F'}>Female</option>
                                        <option value={'O'}>Other</option>
                                    </select>
                                    <label>Gender</label>
                                </div>
                                <div className="row no-gutters mb-3">
                                    <div className="col-auto">
                                        <img src={`https://www.countryflags.io/${this.state.countryCode}/flat/64.png`} />
                                    </div>
                                    <div className="col">
                                        <div className="form-floating">
                                            <input type="number" name="phone" value={this.state.phone} onChange={this.handleInputChange} className="form-control" placeholder="Phone" />
                                            <label className="ms-2">Phone</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} className="form-control" placeholder="Email" />
                                    <label>Email</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} className="form-control" placeholder="Password" />
                                    <label>Password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" name="city" value={this.state.city} onChange={this.handleInputChange} className="form-control" placeholder="City" />
                                    <label>City</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="number" name="zipcode" value={this.state.zipcode} onChange={this.handleInputChange} className="form-control" placeholder="Zipcode" />
                                    <label>Pin Code</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <CountryDropdown className="form-select" name="COUNTRY" value={this.state.countryCode} valueType="short" showDefaultOption={false} onChange={(val) => { this.selectCountry(val) }} />
                                    <label for="floatingSelectGrid">Country</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" name="contactName" value={this.state.contactName} onChange={this.handleInputChange} className="form-control" placeholder="Contact Name" />
                                    <label>Contact Name</label>
                                </div>
                                <div className="row no-gutters mb-3">
                                    <div className="col-auto">
                                        <img src={`https://www.countryflags.io/${this.state.countryCode}/flat/64.png`} />
                                    </div>
                                    <div className="col">
                                        <div className="form-floating">
                                            <input type="number" name="contactNumber" value={this.state.contactNumber} onChange={this.handleInputChange} className="form-control" placeholder="Contact Number" />
                                            <label className="ms-2">Contact Number</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" name="group" value={this.state.group} onChange={this.handleInputChange} className="form-control" placeholder="Group" />
                                    <label>Group</label>
                                </div>

                                <div className="d-grid gap-2">
                                    <button className="btn btn-outline-primary btn-lg" type="button" onClick={this.handleSubmit} disabled={this.state.loading}>
                                        {this.state.loading ? (
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : ('Submit')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

export default App;
