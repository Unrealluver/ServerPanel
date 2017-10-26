import { API_ROOT, HTTP_GET, HTTP_POST, JSON_CONTENT_TYPE } from '../consts/index'
import { observable, action } from 'mobx'
import { fetchErrorHandler } from '../utils'
class UserStore {
  // 标记当前是否处于加载状态
  @observable inProgress = false
  // 标记当前存在的错误
  @observable errors = null

  @observable username = undefined
  @observable token = undefined

  @observable loginValues = {
    username: 'fredliang',
    password: 'P@ssw0rd'
  }

  @action setLoginUsername (username) {
    this.loginValues.username = username
  }

  @action setLoginPassword (password) {
    this.loginValues.password = password
  }

  @observable regValues = {
    username: '',
    password: '',
    email: ''
  }

  @action setRegUsername (username) {
    this.regValues.username = username
  }

  @action setRegEmail (email) {
    this.regValues.email = email
  }

  @action setRegPassword (password) {
    this.regValues.password = password
  }

  @action reset () {
    this.regValues.username = ''
    this.regValues.email = ''
    this.regValues.password = ''
  }

  @action register () {
    this.inProgress = true
    this.clearErrors()
    if (!this.regValues.username || !this.regValues.password || !this.regValues.email) {
      this.errors = new Error('用户名或密码或邮箱不合法！')
      this.inProgress = false
      return
    }
    return fetch(`${API_ROOT}/user/register`, {
      method: HTTP_POST,
      headers: {
        'Content-Type': JSON_CONTENT_TYPE
      },
      body: JSON.stringify(this.regValues)
    }).then(res => {
      this.inProgress = false
      return fetchErrorHandler(res)
    }).then(json => {
      this.token = json.token
    }).catch(error => {
      this.errors = error
    })
  }

  @action login () {
    this.inProgress = true
    this.clearErrors()
    if (!this.loginValues.username || !this.loginValues.password) {
      this.errors = new Error('用户名或密码不合法！')
      this.inProgress = false
      return
    }
    return fetch(`${API_ROOT}/user/login`, {
      method: HTTP_POST,
      headers: {
        'Content-Type': JSON_CONTENT_TYPE
      },
      body: JSON.stringify(this.loginValues)
    }).then(res => {
      this.inProgress = false
      return fetchErrorHandler(res)
    }).then(json => {
      this.token = json.token
    }).catch(error => {
      this.errors = error
    })
  }

  @action clearErrors () {
    this.errors = null
  }
}

export default new UserStore()
