import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const styles = {
  btn: {
    textAlign: 'center',
  },
  h2: {
    color: '#26B8D0',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 200,
  },
};
const Acclaim = ({ onClick }) => (
    <div>
      <h2 style={styles.h2} >Cours brian, Cours !</h2>
      <p>Brian arrive à Paris, et aura déjà parcouru plus de 900km.</p>
      <p>Pour l&apos;encourager dans cette dernière ligne droite jusqu&apos;à
         Calais, vous pouvez le soutenir symboliquement dès maintenant
         en vous ajoutant sur cette carte.</p>
      <p>Sinon il suffit de Tweeter votre soutien avec le hashtag <a target="_blank" href="https://twitter.com/search?q=%23defidemalade&lang=fr">#DefiDeMalade</a> en activant la géolocalisation</p>
      <div style={styles.btn}>
        <RaisedButton primary label="J'encourage Brian" onClick={onClick} />
      </div>
      <Divider style={{ marginTop: 20, marginBottom: 20 }} />
    </div>

  );


export default Acclaim;
