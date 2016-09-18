require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//获取图片数据
let imageDatas = require('../data/imageDatas.jsom');

let yeomanImage = require('../images/yeoman.png');

//图片信息转换为URL信息
imageDatas = (function genImageURL(imageDatasArr) {
  for(let i=0,j=imageDatasArr.length; i<j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
