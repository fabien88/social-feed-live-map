import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { InfoWindow } from 'react-google-maps';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import IconButton from 'material-ui/IconButton';
import '../fonts/styles.css';
import s from './styles.css';
import Ink from 'react-ink';

import {
  ShareButtons,
  ShareCounts,
  generateShareIcon,
} from 'react-share';
const {
  FacebookShareButton,
  TwitterShareButton,
} = ShareButtons;
const {
  FacebookShareCount,
} = ShareCounts;

import { onShowThankYou, onHideThankYou } from '../actions.js';
import 'whatwg-fetch';
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const BACKEND_URL = 'https://enigmatic-depths-26837.herokuapp.com';

const styles = {
  form: {
    margin: 20,
    textTransform: 'uppercase',
  },
  h2: {
    color: '#37bcd1',
    textTransform: 'uppercase',
    fontWeight: 400,
    lineHeight: 1,
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
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    paddingTop: 0,
    textAlign: 'center',
  },
};
const CursorWindowW = ({ myPos }) => {
  if (myPos) {
    // We don't show the dialog if pos changed
    return null;
  }
  return (
    <InfoWindow
      options={{ disableAutoPan: false }}
    >
      <div style={{ maxWidth: 200, textAlign: 'center', padding: 10 }}>
        Faites glisser le curseur bleu pour vous localiser sur la carte
      </div>
    </InfoWindow>
  );
};

const ShareIcons = ({ size, text, flexJustify = 'center' }) => {
  const websiteUrl = 'http://bit.ly/2r4Cdnv';
  const facebookMessage = `J'encourage Brian dans son #DefiDeMalade contre la #mucoviscidose ! Soutenez-le vous aussi : ${websiteUrl}`;
  const twitterMessage = `J'encourage Brian dans son #DefiDeMalade contre la #mucoviscidose ! Soutenez-le vous aussi : ${websiteUrl} pic.twitter.com/F65A33Mj7R`;
  const tweetIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}`;
  return (
    <div style={{ display: 'flex', justifyContent: flexJustify, alignItems: 'center' }}>
      <span style={{ paddingRight: 5 }}>{text}</span>
      <a style={{ paddingRight: 5 }} href={tweetIntentUrl} rel="noopener noreferrer" target="_blank" >
        <TwitterIcon size={size} round />
      </a>
      <FacebookShareButton
        url={websiteUrl}
        title="J'encourage Brian dans son #DefiDeMalade contre la #mucoviscidose"
        description={facebookMessage}
        picture="https://d1vfuujltsw10o.cloudfront.net/Visuel_Partage_Carte.jpg"
      >
        <FacebookIcon size={size} round />
      </FacebookShareButton>
      {/* <FacebookShareCount url={'http://lemonde.fr'} >
        {shareCount => (
          <span className="myShareCountWrapper">{shareCount}</span>
        )}
      </FacebookShareCount> */}
    </div>
  );
};

const CursorWindow = connect(({ myPos }) => ({
  myPos,
}))(CursorWindowW);
export { CursorWindow };

const ActionButton = ({ onClick }) => (
  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 40 }}>
    <div
      className={s.btn}
      style={{ width: 250, position: 'relative' }}
      // labelStyle={{ fontSize: 18 }}
      // backgroundColor="#37bcd1"
      // hoverColor="#37bcd1"
      // primary
      // label="J'encourage Brian"
      onClick={onClick}
    >      J'encourage Brian
      <Ink />
    </div>
  </div>
);

const AcclaimIntroW = ({ onClick, showThankYou, onHideThankYou }) => {
  if (showThankYou) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>

        <div onClick={onHideThankYou} style={{ textAlign: 'right' }}>
          <IconButton>
            <img alt="close" width={30} src="https://d1vfuujltsw10o.cloudfront.net/icons/Close_btn.png" />
          </IconButton>
        </div>

        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <div style={styles.title}>
            <h2 style={styles.h2} >Merci !</h2>
          </div>
          <p>Et hop, un encouragement de plus, merci à vous&nbsp;!</p>
          <p style={{ paddingTop: 30 }}>Multipliez les encouragements pour Brian en partageant la carte&nbsp;!</p>
          <div style={{ paddingTop: 50, textAlign: 'center', paddingBottom: 100 }}>
            <ShareIcons size={60} flexJustify="center" />
          </div>


        </div>
      </div>

    );
  }
  return (
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      <div style={styles.title}>
        <div>
          <img width={100} style={{ paddingRight: 20 }} src="https://d1vfuujltsw10o.cloudfront.net/icons/Megaphone_defiRespire.png" alt="megaphone" />
        </div>
        <div>
          <h2 style={styles.h2} >Cours brian,<br />Cours !</h2>
        </div>

      </div>
      <p>Brian arrive à Paris, et aura déjà parcouru plus de 900km.</p>
      <p>Pour l&apos;encourager dans cette dernière ligne droite jusqu&apos;à
           Calais, vous pouvez le soutenir symboliquement dès maintenant
           en vous ajoutant sur cette carte.</p>
      <p>Sinon il suffit de Tweeter votre soutien avec le hashtag <a style={{ color: '#37bcd1', textDecoration: 'none' }} target="_blank" href="https://twitter.com/search?q=%23defidemalade&lang=fr">#DefiDeMalade</a> en activant la géolocalisation</p>
      <ActionButton onClick={onClick} />

      <div style={{ paddingTop: 50, textTransform: 'uppercase', fontWeight: 600, textAlign: 'right' }}>
        <ShareIcons size={40} text={'Partager : '} flexJustify="flex-end" />
      </div>
    </div>
  );
};

const AcclaimIntro = connect(({ showThankYou }) => ({
  showThankYou,
}), { onHideThankYou })(AcclaimIntroW);

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
    const { myPos, onFlip } = this.props;
    const { nameEmptyErr, messageEmptyErr, myPosEmptyErr } = this.state;

    return (
      <div style={styles.form}>
        <div onClick={onFlip} style={{ position: 'absolute', textAlign: 'right', top: 3, right: 3 }}>
          <IconButton>
            <img alt="close" width={30} src="https://d1vfuujltsw10o.cloudfront.net/icons/Close_btn.png" />
          </IconButton>
        </div>

        <h2 style={styles.h2} >Encouragez Brian</h2>
        <p>1. Votre emplacement</p>

        {myPos ?
          <div style={styles.lngLat}>{`latitude: ${myPos.lat.toFixed(2)}, longitude : ${myPos.lng.toFixed(2)}`}</div>
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
          floatingLabelText="2. Votre nom et prénom"
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
            <ActionButton
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

        <div style={{ textAlign: 'center', textTransform: 'none', paddingTop: 36, paddingLeft: 40 }}>
          <p style={{ fontSize: 10, lineHeight: 1 }}>{"Nous n'utiliserons pas vos informations personnelles."}</p>
          <p style={{ fontSize: 10, lineHeight: 1 }}>{'Nous ne pourrons être tenus responsables du contenu de votre message.'}</p>
        </div>


      </div>
    );
  }
}

const AcclaimFormConnected = connect(state => ({
  myPos: state.myPos,
}), { onShowThankYou })(AcclaimForm);

export { AcclaimFormConnected as AcclaimForm };
