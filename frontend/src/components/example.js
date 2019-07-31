import React, { Component } from 'react';
import { connect } from 'react-redux';

const token = localStorage.getItem('jwtToken');

class Example extends Component {
    
    render() {
    return (
        <div class="card">
        <div class="card-body">
            <h5 class="card-title">Steve Jobs</h5>
            <h6 class="card-subtitle mb-2 text-muted">steve@apple.com</h6>
            <p class="card-text">JWT Token: {token}</p>
        </div>
        </div>
    );
    }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Example);