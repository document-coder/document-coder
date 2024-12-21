import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetCoding } from 'src/actions/api';
import PersonalProgressView from 'src/components/widgets/PersonalProgressView'

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const CSRF_TOKEN = getCookie('csrftoken');

function Hbar() {
  return <div className='Hbar' />
}

class Step1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      company_name: "",
      name: "",
      tos: "",
      eu_tos: "",
      gdpr_poicy: "",
      ccpa_policy: "",
      cookie_policy: "",
      privacy_policy: "",
      eu_privacy_policy: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(response) {
    this.props.setState({
      policy: this.gen_submit(),
      current_step: 2
    })
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  gen_submit() {
    const s = this.state
    return {
      company_name: s.company_name,
      name: s.name,
      urls: {
        tos: s.tos,
        eu_tos: s.eu_tos,
        gdpr_poicy: s.gdpr_poicy,
        ccpa_policy: s.ccpa_policy,
        cookie_policy: s.cookie_policy,
        privacy_policy: s.privacy_policy,
        eu_privacy_policy: s.eu_privacy_policy,
      }
    }
  }
  render() {
    if (this.props.state.current_step == 1)
      return <div id='step1'>
        <h2> basic info: </h2>
        <div>
          <label> company_name: </label>
          <input
            type='text'
            name='company_name'
            value={this.state.company_name}
            onChange={this.handleChange}
            placeholder="Example Corp" />
        </div>
        <div>
          <label> name: </label>
          <input
            type='text'
            name='name'
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="example.com" />
        </div>
        <h2> urls of policies (leave blank if unused): </h2>
        <div>
          <label> tos: </label>
          <input
            type='text'
            name='tos'
            value={this.state.tos}
            onChange={this.handleChange}
            placeholder="http://example.com/tos" />
        </div>
        <div>
          <label> eu_tos: </label>
          <input
            type='text'
            name='eu_tos'
            value={this.state.eu_tos}
            onChange={this.handleChange}
            placeholder="http://example.com/eu_tos" />
        </div>
        <div>
          <label> gdpr_poicy: </label>
          <input
            type='text'
            name='gdpr_poicy'
            value={this.state.gdpr_poicy}
            onChange={this.handleChange}
            placeholder="http://example.com/gdpr_poicy" />
        </div>
        <div>
          <label> ccpa_policy: </label>
          <input
            type='text'
            name='ccpa_policy'
            value={this.state.ccpa_policy}
            onChange={this.handleChange}
            placeholder="http://example.com/ccpa_policy" />
        </div>
        <div>
          <label> cookie_policy: </label>
          <input
            type='text'
            name='cookie_policy'
            value={this.state.cookie_policy}
            onChange={this.handleChange}
            placeholder="http://example.com/cookie_policy" />
        </div>
        <div>
          <label> privacy_policy: </label>
          <input
            type='text'
            name='privacy_policy'
            value={this.state.privacy_policy}
            onChange={this.handleChange}
            placeholder="http://example.com/privacy_policy" />
        </div>
        <div>
          <label> eu_privacy_policy: </label>
          <input
            type='text'
            name='eu_privacy_policy'
            value={this.state.eu_privacy_policy}
            onChange={this.handleChange}
            placeholder="http://example.com/eu_privacy_policy" />
        </div>
        <div className='preview'>
          <div>The following <code>Policy</code> will be created on the server:</div>
          <pre>
            {JSON.stringify(this.gen_submit(), undefined, '  ')}
          </pre>
        </div>
        {(this.state.submitting) ?
          <div>Please Wait...</div> :
          <button onClick={this.handleSubmit}> SUBMIT COMPANY INFO! </button>
        }
      </div>
    else if (this.props.state.current_step > 1)
      return <div className="step1-complete">
        <div> The following Policy will be created on the server:
          <pre>
            {JSON.stringify(this.props.state.policy, undefined, '  ')}
          </pre>
        </div>
      </div>
  }
}

class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = { visible: true }
    this.toggle = this.toggle.bind(this)
  }
  toggle() {
    this.setState({ visible: !this.state.visible })
  }
  render() {
    const content = this.props.processed.map((e, i) =>
      <div key={`preview-line-${i}`}>
        <span className="number">{i}</span>
        {e[0].startsWith("§") && e.length == 1 ? <h1> {e} </h1> : <div> {e} </div>}
      </div>
    )
    return <div className='preview'>
      <button onClick={this.toggle}> show/hide preview </button>
      {
        this.state.visible ?
          <div> {content} <button onClick={this.toggle}> show/hide preview </button></div> :
          <div />
      }
    </div>
  }
}

function readFileContent(file) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}
class Step2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tos: "",
      eu_tos: "",
      gdpr_poicy: "",
      ccpa_policy: "",
      cookie_policy: "",
      privacy_policy: "",
      eu_privacy_policy: "",
      processed: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    this.props.setState({
      policy_content: this.state,
      current_step: 4
    })
  }
  async handleChange(event) {
    const input = event.target
    const document = event.target.getAttribute("document")
    if ('files' in input && input.files.length > 0) {
      const content = await readFileContent(input.files[0])
      const resp = await fetch(
        new Request("/helper-api/process_raw", {
          method: "POST",
          headers: { 'Content-Type': 'text/JSON', 'X-CSRFToken': CSRF_TOKEN },
          body: content
        })
      )
      const processed = await resp.json()
      this.setState({
        [document]: processed,
        processed: {
          ...this.state.processed,
          ...{ [document]: processed['content'] }
        }
      })
    }
  }
  render() {
    if (this.props.state.current_step >= 2)
      return <div id='step2'>
        <div>
          <div className='upload-label'> tos </div>
          {this.props.state.current_step == 2 ?
            <input type="file" id="input-tos" name='tos' onChange={this.handleChange} /> :
            <div />
          }
          {this.state['tos'] ?
            <Preview raw={this.state.tos} processed={this.state.processed.tos} /> :
            <div>(no file selected)</div>
          }
        </div>
        <div>
          <div className='upload-label'> eu_tos </div>
          {this.props.state.current_step == 2 ?
            <input type="file" id="input-eu_tos" name='eu_tos' onChange={this.handleChange} /> :
            <div />
          }
          {this.state['eu_tos'] ?
            <Preview raw={this.state.eu_tos} processed={this.state.processed.eu_tos} /> :
            <div>(no file selected)</div>
          }
        </div>
        <div>
          <div className='upload-label'> gdpr_poicy </div>
          {this.props.state.current_step == 2 ?
            <input type="file" id="input-gdpr_poicy" name='gdpr_poicy' onChange={this.handleChange} /> :
            <div />
          }
          {this.state['gdpr_poicy'] ?
            <Preview raw={this.state.gdpr_poicy} processed={this.state.processed.gdpr_poicy} /> :
            <div>(no file selected)</div>
          }
        </div>
        <div>
          <div className='upload-label'> ccpa_policy </div>
          {this.props.state.current_step == 2 ?
            <input type="file" id="input-ccpa_policy" name='ccpa_policy' onChange={this.handleChange} /> :
            <div />
          }
          {this.state['ccpa_policy'] ?
            <Preview raw={this.state.ccpa_policy} processed={this.state.processed.ccpa_policy} /> :
            <div>(no file selected)</div>
          }
        </div>
        <div>
          <div className='upload-label'> cookie_policy </div>
          {this.props.state.current_step == 2 ?
            <input type="file" id="input-cookie_policy" name='cookie_policy' onChange={this.handleChange} /> :
            <div />
          }
          {this.state['cookie_policy'] ?
            <Preview raw={this.state.cookie_policy} processed={this.state.processed.cookie_policy} /> :
            <div>(no file selected)</div>
          }
        </div>
        <div>
          <div className='upload-label'> privacy_policy </div>
          {this.props.state.current_step == 2 ?
            <input type="file" id="input-privacy_policy" name='privacy_policy' onChange={this.handleChange} /> :
            <div />
          }
          {this.state['privacy_policy'] ?
            <Preview raw={this.state.privacy_policy} processed={this.state.processed.privacy_policy} /> :
            <div>(no file selected)</div>
          }
        </div>
        <div>
          <div className='upload-label'> eu_privacy_policy </div>
          {this.props.state.current_step == 2 ?
            <input type="file" id="input-eu_privacy_policy" name='eu_privacy_policy' onChange={this.handleChange} /> :
            <div />
          }
          {this.state['eu_privacy_policy'] ?
            <Preview raw={this.state.eu_privacy_policy} processed={this.state.processed.eu_privacy_policy} /> :
            <div>(no file selected)</div>
          }
        </div>
        <Hbar />
        <h1 id='s4'> Step 3: Check files were processed correctly </h1>
        <div> Check that the policy text looks right. </div>
        <div> Check that the company info and links look right </div>
        <div> text stein with any questions (323) 393-3553 </div>
        {this.props.state.current_step == 2 ?
          <button onClick={this.handleSubmit}> Files are ready to upload. </button> :
          <div />
        }
      </div>
    else
      return <div className="pending-step">
        <Hbar />
        <h1 id='s4'> Step 3: Check files were processed correctly </h1>
      </div>
  }
}
class Step4 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      "log": ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.uploader = this.uploader.bind(this);
    this.log = this.log.bind(this);
  }
  log(s) {
    this.setState({ log: this.state.log + '\n' + s })
  }
  handleSubmit() {
    this.uploader()
    this.log("upload started...")
  }
  async uploader() {
    const s = this.props.state
    const params = {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': CSRF_TOKEN }
    }
    var resp
    setTimeout(this.log, 0, "uploading company info...")
    resp = await fetch(new Request("/api/policy/",
      { ...params, body: JSON.stringify(s.policy) }
    ))
    if (resp.status != 201) {
      setTimeout(this.log, 0, "ERROR:" + resp.statusText)
      return
    }
    const policy = await resp.json();
    console.log(policy);
    setTimeout(this.log, 0, "Company loaded!")

    setTimeout(this.log, 0, "uploading HTML...")
    resp = await fetch(new Request("/api/raw_policy_instance/",
      {
        ...params, body: JSON.stringify({
          policy_id: policy.id,
          raw_content_blocks: s.policy_content,
          capture_date: "" + (new Date()).toISOString().substr(0, 10),
          capture_source: "manual upload"
        })
      }
    ))
    if (resp.status != 201) {
      setTimeout(this.log, 0, "ERROR:" + resp.statusText)
      return
    }
    const rpi = await resp.json()
    console.log(rpi);
    setTimeout(this.log, 0, "HTML loaded!, Raw Policy ID: " + rpi.id)


    setTimeout(this.log, 0, "processing policy...")
    resp = await fetch(new Request("/api/policy_instance/",
      {
        ...params, body: JSON.stringify({
          policy_id: policy.id,
          content: s.policy_content.processed,
          scan_dt: "" + (new Date()).toISOString()
        })
      }
    ))
    if (resp.status != 201) {
      setTimeout(this.log, 0, "ERROR:" + resp.statusText)
      return
    }
    const pi = await resp.json();
    console.log(pi)
    setTimeout(this.log, 0, "Policy Text loaded! Policy Scan ID: " + pi.id)
    setTimeout(this.log, 0, "Upload complete! ")
    this.setState({ pi_id: pi.id })
  }
  render() {
    if (this.props.state.current_step >= 4)
      return <div id='step4'>
        <div> Hit this button to finish loading stuff.</div>
        <div> After everything finishes loading you will be redirected to the coding page. Make sure to save the link </div>
        <div> If something breaks, call stein. </div>
        {this.state.log ?
          <pre>{this.state.log}</pre> :
          <button onClick={this.handleSubmit}> I understand. Upload everything! </button>
        }
        {this.state.pi_id ?
          <div>Link to policy coding page: <a href={`/code-policy/${this.state.pi_id}/11`}>HERE</a></div> :
          <div />}
      </div>
    else return <div className="pending-step" />
  }
}

export default class UploadApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_step: 1,
    }
    this.setState = this.setState.bind(this)
  }

  render() {
    return <div id='demo-container'>
      <style> {
        ".Hbar { border-bottom: 2px solid black; display: block; </style>; margin: 1em 0 }" +
        "label {display:inline-block; width: 120px; margin-top: 4px}" +
        "input[type=text]{border: 1px solid black; width: 400px;}" +
        ".preview{border:1px solid black; background: #eec; padding:8px; margin:8px;}" +
        ".upload-label{margin-top: 8px; font-weight: bold;}" +
        ".number{ font-size: 8px; height: 10px; display: block; margin-left: -6px;}"
      } </style>
      <h1> Upload tool </h1>
      <h2> Warning </h2>
      <h3>This tool was written in a few hours and doesn't have any sort of "undo" mechanic!
        <br />Please double-check when you enter information before completing each step.</h3>
      <Hbar />
      <h1 id='s1'> Step 1: Company Info</h1>
      <Step1 state={this.state} setState={this.setState} />
      <Hbar />
      <h1 id='s2'> Step 2: Load and Process HTML files</h1>
      <Step2 state={this.state} setState={this.setState} />
      <Hbar />
      <h1 id='s4'> Step 4: Upload everything! </h1>
      <Step4 state={this.state} setState={this.setState} />
      <Hbar />
      <h1 id='s4'> Step 5: Copy the link to the policy coding page and save it somewhere </h1>
    </div>
  }
}
