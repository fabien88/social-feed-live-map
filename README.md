
# SocialFeed-Live-Map 

Une carte affichant les supporters de la course de Brian pour son défi de malade.  La carte est reliée à une table firebase connectée en temps réel sur les tweets ayant le hashtag [#DefiDeMalade](https://twitter.com/search?q=defidemalade&src=typd&lang=fr), les commentaires de la page Facebook [Défi Respire](https://www.facebook.com/respire.defi/), et tous les commentaires déposés directement par les utilisateurs sur le site internet [http://defi-respire.fr](http://defi-respire.fr)
Démo consultable ici [http://tweetmap-9c788.firebaseapp.com](http://tweetmap-9c788.firebaseapp.com) et là [http://defi-respire.fr](http://defi-respire.fr). 
    
### Getting Started


Compile and launch your app by running:

```shell
$ yarn start                    # Compiles the app and opens it in a browser with "live reload"
```

You can also test your app in release (production) mode by running `yarn start -- --release` or
with HMR and React Hot Loader disabled by running `yarn start -- --no-hmr`. The app should become
available at [http://localhost:3000/](http://localhost:3000/).


### How to Test

The unit tests are powered by [chai](http://chaijs.com/) and [mocha](http://mochajs.org/).

```shell
$ yarn lint                     # Check JavaScript and CSS code for potential issues
$ yarn test                     # Run unit tests. Or, `yarn run test:watch`
```


### How to Deploy

Update `publish` script in the [`tools/publish.js`](tools/publish.js) file with your full Firebase
project name as found in your [Firebase console](https://console.firebase.google.com/). Note that
this may have an additional identifier suffix than the shorter name you've provided. Then run:

```shell
$ yarn deploy                  # Builds and deployes the app to Firebase
```

The first time you publish, you will be prompted to authenticate with Google and generate an
authentication token in order for the publish script to continue.


If you need to build the project without publishing it, simply run:

```shell
$ yarn build                    # Compiles the app into the /public/dist folder
```

### How to Contribute

Anyone and everyone is welcome to [contribute](CONTRIBUTING.md) to this project. The best way to
start is by checking our [open issues](https://github.com/kriasoft/react-static-boilerplate/issues),
[submit a new issues](https://github.com/kriasoft/react-static-boilerplate/issues/new?labels=bug) or
[feature request](https://github.com/kriasoft/react-static-boilerplate/issues/new?labels=enhancement),
participate in discussions, upvote or downvote the issues you like or dislike, send [pull
requests](CONTRIBUTING.md#pull-requests).


### License

Ce projet est basé sur le boiler plate [react-static-boilerplate](https://github.com/kriasoft/react-static-boilerplate)

Copyright © 2015-present Kriasoft, LLC. This source code is licensed under the MIT license found in
the [LICENSE.txt](https://github.com/kriasoft/react-static-boilerplate/blob/master/LICENSE.txt) file.


