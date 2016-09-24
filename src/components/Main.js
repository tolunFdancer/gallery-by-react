require('normalize.css/normalize.css');
require('styles/App.css');
//var imageDatas = require('../data/imageDatas.json');
import React from 'react';
import ReactDOM from 'react-dom';

//import imageData from '../data/imageDatas.json';
//获取图片数据
let imageDatas = require('../data/imageDatas.json');
//var imageDatas = imageData;
//图片信息转换为URL信息
/*imageDatas = (function genImageURL(imageDatasArr) {
  for(let i=0,j=imageDatasArr.length; i<j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);*/

//获取区间内的随机值
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

class AppComponent extends React.Component {
  //noinspection JSAnnotator

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: {

      }
    };
  }

  //noinspection JSAnnotator
  Constant: {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0,0]
    }
  };

  /**
   *  重新布局所有图片
   * @param centerIndex 指定居中那个图片index
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random() * 2), //取一个或不取

        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //居中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;

        //取出布局在上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局上侧图片
        imgsArrangeTopArr.forEach(function(value, index) {
          imgsArrangeTopArr[index].pos = {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          };
        });

        //布局左右两侧的图片
        for(let i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++) {
          let hPosRangeLORX = null;
          if(i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i].pos = {
            top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
            left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          };
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  }

  /*getInitialState() {
    return {
      imgsArrangeArr: [
        /!*{
          pos: {
            left: '0',
            top: '0'
          }
        }*!/
      ]
    };
  }*/

  componentDidMount() {

    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //获取左侧 右侧位置取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //获取上侧位置取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    let controllerUnits = [],
        imgFigures = [];
    imageDatas.forEach(function(value, index) {
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        };
      }
      imgFigures.push(<ImgFigure key={index} data={value} arr={this.state.imgsArrangeArr[index]} ref={'imgFigure'+ index } />);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">{imgFigures}</section>
        <nav className="controller-nav">{controllerUnits}</nav>
      </section>
    );
  }
}

class ImgFigure extends React.Component {
  render() {
    let styleObj = {};
    if(this.props.arr.pos) {
      styleObj = this.props.arr.pos;
    }
    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} className="img-size"/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
