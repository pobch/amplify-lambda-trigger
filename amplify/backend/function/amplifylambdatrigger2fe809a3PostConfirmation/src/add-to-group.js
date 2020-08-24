/* eslint-disable-line */ const aws = require('aws-sdk')

exports.handler = async (event, context, callback) => {
  const cognitoProvider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })

  let isAdmin = false
  const adminEmails = ['pob.ch1@yandex.com']

  if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
    isAdmin = true
  }

  const groupParams = {
    UserPoolId: event.userPoolId,
  }

  const userParams = {
    UserPoolId: event.userPoolId,
    Username: event.userName,
  }

  if (isAdmin) {
    groupParams.GroupName = 'Admin'
    userParams.GroupName = 'Admin'

    try {
      await cognitoProvider.getGroup(groupParams).promise()
    } catch (e) {
      await cognitoProvider.createGroup(groupParams).promise()
    }

    try {
      await cognitoProvider.adminAddUserToGroup(userParams).promise()
      callback(null, event)
    } catch (e) {
      callback(e)
    }
  } else {
    callback(null, event)
  }
}
