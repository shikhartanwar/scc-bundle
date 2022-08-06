/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["scc"] = factory();
	else
		root["scc"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/console-lib.js":
/*!****************************!*\
  !*** ./src/console-lib.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init),\n/* harmony export */   \"orchestrate\": () => (/* binding */ orchestrate)\n/* harmony export */ });\n/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers.js */ \"./src/helpers.js\");\n/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./env.js */ \"./src/env.js\");\n\n\nconst baseUrl = _env_js__WEBPACK_IMPORTED_MODULE_1__.SCCVars.TRANSPORTER_BASE_URL;\nlet authToken = _env_js__WEBPACK_IMPORTED_MODULE_1__.SCCVars.AUTH_TOKEN;\nconst apiKey = _env_js__WEBPACK_IMPORTED_MODULE_1__.SCCVars.API_KEY;\nfunction init() {\n  if (_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isUserLoggedInIMS()) {\n    console.log(\"Found adobeIms\");\n    const token = adobeIMS.getAccessToken().token || adobeIMS.token;\n    authToken = \"Bearer \" + token;\n  }\n}\n\nfunction getHeaders() {\n  return {\n    'content-type': 'application/json',\n    Authorization: authToken,\n    'x-api-key': apiKey\n  };\n}\n\nasync function getOrganizations() {\n  const url = `${baseUrl}/organizations`;\n  const options = {\n    method: 'GET',\n    headers: getHeaders()\n  };\n  return fetch(url, options).then(res => res.json());\n}\n\nasync function getFirstOrganization() {\n  return getOrganizations().then(orgs => orgs[0]);\n}\n\nasync function createProject(orgId, title) {\n  const url = `${baseUrl}/organizations/${orgId}/projects`;\n  let requestBody = {\n    \"name\": _helpers_js__WEBPACK_IMPORTED_MODULE_0__.generateRandomName(10),\n    \"title\": title,\n    \"type\": \"default\"\n  };\n  let options = {\n    method: 'POST',\n    headers: getHeaders(),\n    body: JSON.stringify(requestBody)\n  };\n  return fetch(url, options).then(res => res.json());\n}\n\nasync function getProjects(orgId) {\n  const queryParams = new URLSearchParams({\n    size: '2',\n    page: '1',\n    sortField: 'date_last_modified',\n    sortOrder: 'DESC'\n  });\n  const url = `${baseUrl}/organizations/${orgId}/projects?` + queryParams;\n  let options = {\n    method: 'GET',\n    headers: getHeaders()\n  };\n  return fetch(url, options).then(res => res.json());\n}\n\nasync function getFirstProject(orgId) {\n  return getProjects(orgId).then(projects => projects[0]);\n}\n\nasync function getWorkspace(orgId, projectId) {\n  let url = `${baseUrl}/organizations/${orgId}/projects/${projectId}/workspaces`;\n  let options = {\n    method: 'GET',\n    headers: getHeaders()\n  };\n  return fetch(url, options).then(res => res.json()).then(workspaces => workspaces[0]);\n}\n\nasync function createAdobeIDCredentials(orgId, projectId, workspaceId) {\n  const url = `${baseUrl}/organizations/${orgId}/projects/${projectId}/workspaces/${workspaceId}/credentials/adobeId`;\n  const credNameAndDescription = `Credential ${_helpers_js__WEBPACK_IMPORTED_MODULE_0__.generateRandomName(12)}`;\n  let credDetails = {\n    \"name\": credNameAndDescription,\n    \"description\": credNameAndDescription,\n    \"platform\": \"WebApp\",\n    \"redirectUriList\": ['https://adobe\\\\.com'],\n    \"defaultRedirectUri\": 'https://adobe.com'\n  };\n  let options = {\n    method: 'POST',\n    headers: getHeaders(),\n    body: JSON.stringify(credDetails)\n  };\n  return fetch(url, options).then(res => res.json());\n}\n\nasync function subscribeAdobeIdIntegrationToServices(orgId, credentialId, apiOrSdkCode) {\n  const url = `${baseUrl}/organizations/${orgId}/integrations/adobeid/${credentialId}/services`;\n  let requestBody = [{\n    \"sdkCode\": apiOrSdkCode\n  }];\n  let options = {\n    method: 'PUT',\n    headers: getHeaders(),\n    body: JSON.stringify(requestBody)\n  };\n  return fetch(url, options).then(res => res.json());\n}\n\nfunction getConsoleProjectUrl(orgId, projectId) {\n  return `${_env_js__WEBPACK_IMPORTED_MODULE_1__.SCCVars.CONSOLE_BASE_URL}/projects/${orgId}/${projectId}/overview`;\n}\n\nfunction orchestrate(projectTitle, apiCode) {\n  let orgId, projectId, workspaceId, credential;\n  return getFirstOrganization() // Get/Create project flow. Keep any one commented\n  .then(org => {\n    orgId = org.id; // return getFirstProject(orgId);\n\n    return createProject(orgId, projectTitle);\n  }) // get workspace\n  .then(projectResponse => {\n    console.log(projectResponse);\n    projectId = projectResponse.projectId || projectResponse.id;\n    return getWorkspace(orgId, projectId);\n  }) // create credential\n  .then(workspace => {\n    workspaceId = workspace.id;\n    return createAdobeIDCredentials(orgId, projectId, workspaceId);\n  }) // Subscribe credential\n  .then(credentialRes => {\n    credential = credentialRes;\n    return subscribeAdobeIdIntegrationToServices(orgId, credential.id, apiCode);\n  }).then(_ => {\n    return {\n      'credential': credential,\n      'projectUrl': getConsoleProjectUrl(orgId, projectId)\n    };\n  });\n}\n\n//# sourceURL=webpack://scc/./src/console-lib.js?");

/***/ }),

/***/ "./src/env.js":
/*!********************!*\
  !*** ./src/env.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SCCVars\": () => (/* binding */ SCCVars)\n/* harmony export */ });\nlet SCCVars = {\n  AUTH_TOKEN: 'Bearer <token>',\n  API_KEY: 'UDPWeb1',\n  TRANSPORTER_BASE_URL: 'https://developers-stage.adobe.io/console',\n  CONSOLE_BASE_URL: 'https://developer-stage.adobe.com/console'\n};\n\n//# sourceURL=webpack://scc/./src/env.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"copyTextToClipboard\": () => (/* binding */ copyTextToClipboard),\n/* harmony export */   \"createElement\": () => (/* binding */ createElement),\n/* harmony export */   \"createSpectrumActionButton\": () => (/* binding */ createSpectrumActionButton),\n/* harmony export */   \"createSpectrumBodyComponent\": () => (/* binding */ createSpectrumBodyComponent),\n/* harmony export */   \"createSpectrumProgressCircle\": () => (/* binding */ createSpectrumProgressCircle),\n/* harmony export */   \"generateRandomName\": () => (/* binding */ generateRandomName),\n/* harmony export */   \"isUserLoggedInIMS\": () => (/* binding */ isUserLoggedInIMS),\n/* harmony export */   \"loadStylesheet\": () => (/* binding */ loadStylesheet)\n/* harmony export */ });\nfunction generateRandomName(length) {\n  var text = \"\";\n  const possible = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\";\n\n  for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));\n\n  return text;\n}\nfunction loadStylesheet(url) {\n  var link = document.createElement('link');\n  link.rel = 'stylesheet';\n  link.type = 'text/css';\n  link.href = url;\n  var entry = document.getElementsByTagName('script')[0];\n  entry.parentNode.insertBefore(link, entry);\n}\nfunction isUserLoggedInIMS() {\n  return typeof adobeIMS === 'object' && adobeIMS !== null && adobeIMS.getAccessToken() !== null;\n}\nfunction createSpectrumBodyComponent(message) {\n  const messageContainer = document.createElement(\"div\");\n  messageContainer.classList.add(\"scc-message-container-body\");\n  const body = document.createElement(\"p\");\n  body.innerHTML = message;\n  body.classList.add(\"spectrum-Body\", 'spectrum-Body--sizeM');\n  messageContainer.appendChild(body);\n  return messageContainer;\n}\nfunction createSpectrumActionButton(text, extraCssClasses = []) {\n  const actionButton = document.createElement(\"button\");\n  actionButton.classList.add('spectrum-ActionButton', 'spectrum-ActionButton--sizeM');\n  extraCssClasses.forEach(cssClass => actionButton.classList.add(cssClass));\n  const actionButtonSpan = document.createElement(\"span\");\n  actionButtonSpan.textContent = text;\n  actionButton.appendChild(actionButtonSpan);\n  return actionButton;\n}\nfunction createSpectrumProgressCircle() {\n  let divContainer = createElement('spectrum-ProgressCircle spectrum-ProgressCircle--indeterminate spectrum-ProgressCircle--large');\n  let divTrack = createElement('spectrum-ProgressCircle-track');\n  divContainer.appendChild(divTrack);\n  let divFills = createElement('spectrum-ProgressCircle-fills');\n  let masks = ['Mask1', 'Mask2'];\n  masks.forEach(mask => {\n    let divMaskFill = createElement(`spectrum-ProgressCircle-fill${mask}`);\n    let divSubMaskFill = createElement(`spectrum-ProgressCircle-fillSub${mask}`);\n    let div3 = createElement('spectrum-ProgressCircle-fill');\n    divSubMaskFill.appendChild(div3);\n    divMaskFill.appendChild(divSubMaskFill);\n    divFills.appendChild(divMaskFill);\n  });\n  divContainer.appendChild(divFills);\n  return divContainer;\n}\nfunction createElement(cssClassString = \"\", elementType = \"div\") {\n  const htmlElement = document.createElement(elementType);\n\n  if (cssClassString !== \"\") {\n    const cssClasses = cssClassString.split(\" \");\n    cssClasses.forEach(cssClass => htmlElement.classList.add(cssClass));\n  }\n\n  return htmlElement;\n}\nfunction copyTextToClipboard(text, successCallback) {\n  if (!navigator.clipboard) {\n    return;\n  }\n\n  navigator.clipboard.writeText(text).then(successCallback, function (err) {\n    console.error('Async: Could not copy text: ', err);\n  });\n}\n\n//# sourceURL=webpack://scc/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"webWidget\": () => (/* reexport safe */ _widget__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widget */ \"./src/widget.js\");\n\n\n\n//# sourceURL=webpack://scc/./src/index.js?");

/***/ }),

/***/ "./src/widget.js":
/*!***********************!*\
  !*** ./src/widget.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _console_lib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./console-lib.js */ \"./src/console-lib.js\");\n/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ \"./src/helpers.js\");\n\n\n\nclass webWidget {\n  constructor({\n    position = \"top-right\",\n    apiCode,\n    isLoggedIn,\n    placementOffsets: placementOffsets\n  }) {\n    this.position = this.getPosition(position, placementOffsets);\n    this.apiCode = apiCode;\n    this.open = false;\n    this.initialise(isLoggedIn);\n    this.createStyles();\n  }\n\n  getPosition(position, placementOffsets) {\n    const [vertical, horizontal] = position.split(\"-\");\n    let placementOffsetsJson = {};\n\n    if (placementOffsets) {\n      placementOffsetsJson = JSON.parse(placementOffsets);\n    }\n\n    const verticalOffset = placementOffsetsJson.vertical || \"17px\";\n    const horizontalOffset = placementOffsetsJson.horizontal || \"240px\";\n\n    if (vertical == \"top\") {\n      this.top = \"45px\";\n    } else if (vertical == \"bottom\") {\n      this.bottom = \"75px\";\n    }\n\n    if (vertical == \"bottom\" && horizontal == \"right\") {\n      this.right = \"-25px\";\n    } else if (vertical == \"bottom\" && horizontal == \"left\") {\n      this.left = 0;\n    }\n\n    if (vertical == \"top\" && horizontal == \"right\") {\n      this.right = \"0px\";\n    } else if (vertical == \"top\" && horizontal == \"left\") {\n      this.left = \"0px\";\n    }\n\n    return {\n      [vertical]: verticalOffset,\n      [horizontal]: horizontalOffset\n    };\n  }\n\n  initialise(isLoggedIn) {\n    const baseUrl = \"https://cdn.jsdelivr.net/npm/\";\n    const styleSheets = [\"@adobe/spectrum-css@3.0.0/vars/spectrum-global.css\", \"@adobe/spectrum-css@3.0.0/vars/spectrum-medium.css\", \"@adobe/spectrum-css@3.0.0/vars/spectrum-light.css\", \"@spectrum-css/tokens@1.0.4/dist/index.css\", \"@adobe/spectrum-css@3.0.0/dist/components/page/index-vars.css\", \"@adobe/spectrum-css@3.0.0/dist/components/typography/index-vars.css\", \"@adobe/spectrum-css@3.0.0/dist/components/button/index-vars.css\", \"@spectrum-css/progresscircle@1.0.23/dist/index-vars.css\", \"@spectrum-css/actionbutton@2.1.1/dist/index-vars.css\"];\n    styleSheets.forEach(function (css) {\n      _helpers_js__WEBPACK_IMPORTED_MODULE_1__.loadStylesheet(baseUrl + css);\n    });\n    const container = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('spectrum spectrum--medium spectrum--light');\n    container.style.position = \"fixed\";\n    container.style.zIndex = \"2\";\n    Object.keys(this.position).forEach(key => container.style[key] = this.position[key]);\n    document.body.appendChild(container);\n    const buttonContainer = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('scc-button-container');\n    const toggleWidgetButton = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('scc-widget-button spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM', 'button');\n    toggleWidgetButton.style.minWidth = \"140px\";\n    const getCredentialsSpan = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('spectrum-Button-label', 'span');\n    getCredentialsSpan.innerText = \"Get Credentials\";\n    this.getCredentialsContainer = getCredentialsSpan;\n    const closeSpan = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('spectrum-Button-label scc-hidden', 'span');\n    closeSpan.innerText = \"Close\";\n    this.closeContainer = closeSpan;\n    toggleWidgetButton.appendChild(this.getCredentialsContainer);\n    toggleWidgetButton.appendChild(this.closeContainer);\n    buttonContainer.appendChild(toggleWidgetButton);\n    buttonContainer.addEventListener(\"click\", this.toggleOpen.bind(this));\n    this.messageContainer = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement(\"scc-hidden scc-message-container spectrum spectrum--medium spectrum--light\");\n    this.createMessageContainerContent(isLoggedIn);\n    container.appendChild(this.messageContainer);\n    container.appendChild(buttonContainer);\n  }\n\n  createLoginMessageContainer(isLoggedIn) {\n    if (isLoggedIn) return;\n    const loginMessageContainer = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createSpectrumBodyComponent('<strong>Please sign in to continue.</strong>');\n    this.messageContainer.append(loginMessageContainer);\n  }\n\n  createProgressBar() {\n    const loader = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createSpectrumProgressCircle();\n    loader.setAttribute('id', 'scc-loader');\n    loader.classList.add('scc-hidden');\n    return loader;\n  }\n\n  createCredentialsContainer() {\n    const subHeader = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('scc-message-container-sub-header');\n    subHeader.textContent = `API KEY (CLIENT ID)`;\n    const keyContainer = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement(\"scc-message-key-container\");\n    const clientIdText = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement(\"scc-clientId-text spectrum-Code spectrum-Code--sizeS\", \"code\");\n    this.clientIdText = clientIdText;\n    keyContainer.appendChild(this.clientIdText);\n    const copyButton = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createSpectrumActionButton(\"Copy\", ['scc-button-container-small']);\n    copyButton.addEventListener('click', this.copyToClipboard.bind(this));\n    keyContainer.appendChild(copyButton);\n    const devConsoleLinkButtonContainer = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createSpectrumActionButton(\"View in Developer Console\", ['scc-dev-console-link-container']);\n    devConsoleLinkButtonContainer.addEventListener('click', this.openDevConsoleLink.bind(this));\n    this.messageContainerBody.appendChild(subHeader);\n    this.messageContainerBody.appendChild(keyContainer);\n    this.messageContainerBody.appendChild(devConsoleLinkButtonContainer);\n  }\n\n  copyToClipboard() {\n    if (!this.credentialsCreated) return;\n    _helpers_js__WEBPACK_IMPORTED_MODULE_1__.copyTextToClipboard(this.clientIdText.innerText, function () {\n      console.log(\"Copied\");\n    });\n  }\n\n  openDevConsoleLink() {\n    if (!this.devConsoleLink) return;\n    window.open(this.devConsoleLink);\n  }\n\n  createForm(isLoggedIn) {\n    // Form that calls Dev Console's APIs on submission\n    const form = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('scc-form spectrum-Form', 'form');\n    this.formContainer = form;\n    const btn = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM', 'button');\n\n    if (!isLoggedIn) {\n      btn.setAttribute('disabled', '');\n    }\n\n    const span = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('spectrum-Button-label', 'span');\n    span.textContent = 'Create Credentials';\n    btn.appendChild(span);\n    form.appendChild(btn);\n    form.addEventListener('submit', this.submit.bind(this));\n    this.messageContainer.appendChild(form);\n  }\n\n  createMessageContainerContent(isLoggedIn) {\n    if (this.credentialsCreated) return;\n    this.messageContainer.innerHTML = \"\";\n    const title = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('spectrum-Heading spectrum-Heading--sizeS', 'h3');\n    title.textContent = `Create New Credentials`;\n    this.messageContainer.appendChild(title);\n    const genericMessageContainer = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createSpectrumBodyComponent('To start using the APIs, you need to create credentials for your application.');\n    this.genericMessageContainer = genericMessageContainer;\n    this.messageContainer.appendChild(genericMessageContainer);\n    this.progressBar = this.createProgressBar();\n    this.messageContainer.appendChild(this.progressBar);\n    this.createLoginMessageContainer(isLoggedIn);\n    const messageContainerBody = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.createElement('scc-message-container-body scc-hidden');\n    this.messageContainer.appendChild(messageContainerBody);\n    this.messageContainerBody = messageContainerBody;\n    this.createCredentialsContainer();\n    this.createForm(isLoggedIn);\n  }\n\n  createStyles() {\n    const styleTag = document.createElement(\"style\");\n    styleTag.innerHTML = `\n          .scc-hidden {\n              display: none !important;\n          }\n          .scc-button-container {\n              background-color: white;\n          }\n          .scc-widget-button {\n            padding: 0 16px;\n          }\n          .scc-button-container-small {\n              display: flex;\n              padding: 12px;\n          }\n          .scc-dev-console-link-container {\n            margin: 8px 0 !important;\n          }\n          .scc-message-container {\n              box-shadow: 0 0 18px 8px rgba(0, 0, 0, 0.1), 0 0 32px 32px rgba(0, 0, 0, 0.08);\n              width: 500px;\n              right: ${this.right};\n              bottom: ${this.bottom};\n              left: ${this.left};\n              top: ${this.top};\n              max-height: 500px;\n              position: absolute;\n              transition: max-height .2s ease;\n              border-style: solid;\n              border-color: var(--spectrum-gray-400);\n              border-radius: 10px;\n              border-width: thin;\n          }\n\n          .scc-message-container.scc-hidden {\n              max-height: 0px;\n          }\n          .scc-message-container h3 {\n              margin: 0;\n              padding: 12px 12px;\n              color: white;\n              background-color: var(--spectrum-global-color-gray-800);\n              border-radius: 8px 8px 0px 0px;\n          }\n          .scc-message-container .content {\n              margin: 20px 10px ;\n              border: 1px solid #dbdbdb;\n              padding: 10px;\n              display: flex;\n              flex-direction: column;\n          }\n          #scc-loader {\n            margin-bottom: 30px;\n            margin-left: 45%;\n          }\n          \n          @-webkit-keyframes spin {\n            0% { -webkit-transform: rotate(0deg); }\n            100% { -webkit-transform: rotate(360deg); }\n          }\n          \n          @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n          }\n\n          .scc-message-container-header {\n            color: #2c2c2c;\n            font-size: 18px;\n            font-weight: 700;\n            line-height: 1.3;\n            font-style: normal;\n            letter-spacing: 0;\n            text-transform: none;\n            margin-bottom: 8px;\n            margin-top: 8px;\n          }\n\n          .scc-message-container-sub-header {\n            color: #736b6b;\n            font-size: 12px;\n            font-weight: 700;\n            line-height: 1.3;\n            font-style: normal;\n            letter-spacing: 0;\n            text-transform: none;\n            margin-bottom: 8px;\n            margin-top: 8px;\n          }\n\n          .scc-message-key-container {\n            display: flex;\n            justify-content: space-between;\n          }\n\n          .scc-clientId-text {\n            display: flex;\n            align-items: center;\n          }\n\n          .scc-message-container-body {\n            padding: 12px;\n          }\n\n          .scc-form {\n            padding: 12px;\n            margin-bottom: 8px;\n          }\n\n      `.replace(/^\\s+|\\n/gm, \"\");\n    document.head.appendChild(styleTag);\n  }\n\n  toggleOpen() {\n    this.open = !this.open;\n\n    if (this.open) {\n      this.getCredentialsContainer.classList.add(\"scc-hidden\");\n      this.closeContainer.classList.remove(\"scc-hidden\");\n      this.messageContainer.classList.remove(\"scc-hidden\");\n    } else {\n      this.createMessageContainerContent(_helpers_js__WEBPACK_IMPORTED_MODULE_1__.isUserLoggedInIMS());\n      this.getCredentialsContainer.classList.remove(\"scc-hidden\");\n      this.closeContainer.classList.add(\"scc-hidden\");\n      this.messageContainer.classList.add(\"scc-hidden\");\n    }\n  }\n\n  showProgressBar() {\n    this.progressBar.classList.remove(\"scc-hidden\");\n    this.messageContainerBody.classList.add(\"scc-hidden\");\n    this.formContainer.classList.add(\"scc-hidden\");\n  }\n\n  hideProgressBar() {\n    this.progressBar.classList.add(\"scc-hidden\");\n    this.messageContainerBody.classList.remove(\"scc-hidden\");\n    this.genericMessageContainer.classList.add(\"scc-hidden\");\n  }\n\n  submit(event) {\n    event.preventDefault();\n    this.showProgressBar();\n    _console_lib_js__WEBPACK_IMPORTED_MODULE_0__.init();\n    let projectTitle = `Project SCC ${_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateRandomName(3)}`;\n    _console_lib_js__WEBPACK_IMPORTED_MODULE_0__.orchestrate(projectTitle, this.apiCode).then(res => {\n      console.log(res);\n      this.clientIdText.innerText = res.credential.apiKey;\n      this.devConsoleLink = res.projectUrl;\n      this.credentialsCreated = true;\n    }).catch(err => console.error(err)).finally(() => this.hideProgressBar());\n  }\n\n}\n\nfunction isWidgetPresent() {\n  return document.getElementById('scc-widget');\n}\n\nfunction getWidgetDataSet() {\n  if (!isWidgetPresent()) return null;\n  let scripts = document.getElementsByTagName('script');\n\n  for (var i = 0; i < scripts.length; i++) {\n    // API Code is mandatory to pass\n    let script = scripts[i];\n    let datasetObj = script.dataset;\n\n    if (script.hasAttribute('data-scc-api-code')) {\n      return datasetObj;\n    }\n  }\n}\n\nwindow.addEventListener('load', function () {\n  if (!isWidgetPresent()) return;\n  const dataset = getWidgetDataSet();\n  console.log(dataset);\n  new webWidget({\n    position: dataset.sccPosition,\n    apiCode: dataset.sccApiCode,\n    isLoggedIn: _helpers_js__WEBPACK_IMPORTED_MODULE_1__.isUserLoggedInIMS(),\n    placementOffsets: dataset.sccPlacementOffsets\n  });\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (webWidget);\n\n//# sourceURL=webpack://scc/./src/widget.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});