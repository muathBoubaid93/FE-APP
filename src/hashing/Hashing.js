import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export class Hashing extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			usersData: [],
			key: '',
			isRequested: false
		};
	}

	requestHash()
	{
		this.setState({...this.state, isRequested: true}, () =>
		{
			try
			{
				axios?.get('http://35.180.138.146:3000/v1/user/account/generateKey',
				{
					headers:
					{
						'Access-Control-Allow-Origin': '*',
						'x-api-version': '1',
						'x-api-lang': 'en',
						'x-api-key': '6712af02b880c31fc7ede1f6774f31d1ce0b02aa9a3rt',
						'x-api-endpoint': 'web'
					}
				})
				?.then(res =>
				{
					if(res?.data?.is_successful)
					{
						this.setState({...this.state, key: res?.data?.response?.key}, () =>
						{
							axios?.get('http://35.180.138.146:3000/v1/user/account/getUsersInfo',
							{
								headers:
								{
									'Access-Control-Allow-Origin': '*',
									'x-api-version': '1',
									'x-api-lang': 'en',
									'x-api-key': '6712af02b880c31fc7ede1f6774f31d1ce0b02aa9a3rt',
									'x-api-endpoint': 'web'
								}
							})
							?.then(res =>
							{
								if(res?.data?.is_successful)
								{
									this.setState({...this.state, usersData: res?.data?.response}, () =>
									{
										var toReturn = [];

										for(var user of this.state?.usersData)
										{
											var info = {};

											for(var objKey of Object.keys(user))
											{
												var decrypted = CryptoJS.AES.decrypt(user[objKey], this.state?.key);
												var originalText = decrypted.toString(CryptoJS.enc.Utf8);
												info[objKey] = originalText;
											}

											toReturn.push(info);
											this.setState({...this.state, usersData: toReturn});
										}
									});
								}
							})
							.catch(e =>
							{
								console.error(e);
							});
						});
					}
				})
				.catch(e =>
				{
					console.error(e);
				});
			}
			catch (e)
			{
				console.error(e);
			}
		});

	}

	render()
	{
		return (
			<>
				<div className='mainContainer'>
					{
						(this.state?.isRequested)
						?
							<table class="table">
								<thead>
									<tr>
										<th scope="col">Username</th>
										<th scope="col">Email</th>
										<th scope="col">Mobile</th>
									</tr>
								</thead>
								<tbody>
									{
										this.state?.usersData?.map((user, index) =>
										{
											return (
												<tr key={index}>
													<td>{user?.username}</td>
													<td>{user?.email}</td>
													<td>{user?.mobile}</td>
												</tr>
											)
										})
									}
								</tbody>
							</table>
						:
							<>
								<button className="btn btn-primary" onClick={() => this.requestHash()}>Click Here</button>
							</>
					}
				</div>
			</>
		);
	}
}
