import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { InfoWindow } from 'react-google-maps';

import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { onShowThankYou } from '../actions.js';
import 'whatwg-fetch';

const BACKEND_URL = 'https://enigmatic-depths-26837.herokuapp.com';

const styles = {
  form: {
    margin: 20,
    textTransform: 'uppercase',
  },
  btn: {
    paddingTop: 20,
    textAlign: 'center',
  },
  h2: {
    color: '#26B8D0',
    textTransform: 'uppercase',
    fontWeight: 200,
    lineHeight: 0.5,
    fontSize: 25,
  },
  center: {
    textAlign: 'center',
  },
  lngLat: {
    textTransform: 'none',
  },
  geoTip: {
    textTransform: 'none',
    textAlign: 'center',
    padding: 20,
    paddingLeft: 60,
    paddingRight: 60,
  },
  title: {
    paddingTop: 30,
    textAlign: 'center',
  },
};
const CursorWindowW = ({ myPos }) => {
  if (myPos) {
    // We don't show the dialog if pos changed
    return null;
  }
  return (
    <InfoWindow >
      <div style={{ maxWidth: 200, textAlign: 'center', padding: 10 }}>
        Faites glisser le curseur bleu pour vous localiser sur la carte
      </div>
    </InfoWindow>
  );
};

const CursorWindow = connect(({ myPos }) => ({
  myPos,
}))(CursorWindowW);
export { CursorWindow };

const AcclaimIntroW = ({ onClick, showThankYou }) => {
  if (showThankYou) {
    return (<div>
        Merci :)
    </div>);
  }
  return (
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      <div style={styles.title}>
        <img width={100} src="https://d1vfuujltsw10o.cloudfront.net/icons/Megaphone_defiRespire.png" alt="megaphone" />
        <h2 style={styles.h2} >Cours brian,</h2>
        <h2 style={styles.h2}>Cours !</h2>
      </div>
      <p>Brian arrive à Paris, et aura déjà parcouru plus de 900km.</p>
      <p>Pour l&apos;encourager dans cette dernière ligne droite jusqu&apos;à
           Calais, vous pouvez le soutenir symboliquement dès maintenant
           en vous ajoutant sur cette carte.</p>
      <p>Sinon il suffit de Tweeter votre soutien avec le hashtag <a target="_blank" href="https://twitter.com/search?q=%23defidemalade&lang=fr">#DefiDeMalade</a> en activant la géolocalisation</p>
      <div style={styles.btn}>
        <RaisedButton primary label="J'encourage Brian" onClick={onClick} />
      </div>
    </div>
  );
};

const AcclaimIntro = connect(({ showThankYou }) => ({
  showThankYou,
}))(AcclaimIntroW);

export { AcclaimIntro };

class AcclaimForm extends React.Component {
  state={
  }

  submitForm = () => {
    const { message, name, captchaCode } = this;
    if (!name) {
      this.setState({ nameEmptyErr: true });
    }
    if (!message) {
      this.setState({ messageEmptyErr: true });
    }
    if (!this.props.myPos) {
      this.setState({ myPosEmptyErr: true });
    }
    if (!message || !name || !this.props.myPos) {
      return;
    }
    const params = {
      message,
      name,
      captchaCode,
      lng: this.props.myPos.lng,
      lat: this.props.myPos.lat,
    };
    this.captcha.reset();
    this.captchaCode = '';
    fetch(`${BACKEND_URL}/postMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    this.props.onShowThankYou();
    this.props.onFlip();
  }

  render() {
    const { myPos } = this.props;
    const { nameEmptyErr, messageEmptyErr, myPosEmptyErr } = this.state;

    return (
      <div style={styles.form}>
        <h2 style={styles.h2} >Encouragez Brian</h2>
        <p>1. Votre emplacement</p>

        {myPos ?
          <div style={styles.lngLat}>{`longitude : ${myPos.lng.toFixed(2)}, latitude: ${myPos.lat.toFixed(2)}`}</div>
        :
          <div
            style={{
              ...styles.geoTip,
              border: myPosEmptyErr ? '2px dashed rgb(244, 67, 54)' : '2px dashed #26B8D0',
            }}
          >            Faites glisser le curseur pour vous localiser sur la carte</div>
        }

        <TextField
          defaultValue=""
          floatingLabelText="2. Votre nom"
          errorText={nameEmptyErr && 'Veuillez remplir ce champ'}
          onChange={(el) => {
            const val = el.target.value;
            this.name = val;
            if (!val) {
              this.setState({ nameEmptyErr: true });
            } else {
              this.setState({ nameEmptyErr: false });
            }
          }}
          fullWidth
        />

        <TextField
          defaultValue=""
          floatingLabelText="3. Votre message"
          errorText={messageEmptyErr && 'Veuillez remplir ce champ'}
          onChange={(el) => {
            const val = el.target.value;
            this.message = val;
            if (!val) {
              this.setState({ messageEmptyErr: true });
            } else {
              this.setState({ messageEmptyErr: false });
            }
          }}
          rows={1}
          rowsMax={3}
          multiLine
          fullWidth
        />

        <form >
          <ReCAPTCHA
            ref={(el) => { this.captcha = el; }}
            size="invisible"
            sitekey="6LcLkCIUAAAAADQJ490cCBc6KyuVuUxd54PZgciY"
            badge="bottomleft"
            onChange={(code) => {
              this.captchaCode = code;
              if (code) {
                this.submitForm();
              }
            }}
          />
          <div style={styles.btn}>
            <RaisedButton
              primary
              label="J'encourage Brian"
              onClick={() => {
                if (this.captchaCode) {
                  this.submitForm();
                } else {
                  this.captcha.execute();
                }
              }}
            />
          </div>
        </form>


      </div>
    );
  }
}

const AcclaimFormConnected = connect(state => ({
  myPos: state.myPos,
}), { onShowThankYou })(AcclaimForm);

export { AcclaimFormConnected as AcclaimForm };
