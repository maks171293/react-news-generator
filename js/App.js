var my_news = [
  {
    author: 'Саша Печкин',
    text: 'В четчерг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'А евро 42!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

window.ee = new EventEmitter();

var Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      bigText: React.PropTypes.string.isRequired
    })
  },
  getInitialState: function(){
    return {
      visible: false
    }
  },
  readMoreClick: function(event){
    event.preventDefault;
    this.setState({
      visible: !this.state.visible
    });
  },
  render: function(){
    return (
      <div className="article">
      <p className="item-author">{this.props.data.author} </p>
      <div className="item-text">{this.props.data.text}
      <p className={"item-big-text " + (this.state.visible ? '': 'none')}>{this.props.data.bigText}</p>
      </div>
      <a href='#'
        onClick={this.readMoreClick}
        className={"news-more " + (this.state.visible?'none':'')}>
        Read more..
      </a>
      </div>
    )
  }
});
var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  getInitialState: function(){
    return{
      counter: 0
    }
  },
  render: function(){
    var data = this.props.data;
    var newsTemplate;

    if(data.length > 0){
      newsTemplate = data.map(function(item, index){
        return (
          <div key={index}>
            <Article data={item}/>
          </div>
        )
      })
    }else{
      newsTemplate = "Unfortunately no news:("
    }

    return (
      <div className="news">
        {newsTemplate}
        <strong className={data.length > 0? '': "none"}> News count: {data.length}</strong>
      </div>
    )
  }
});

var Add = React.createClass({
  getInitialState: function(){
    return{
        agreeNotChecked: true,
        authorIsEmpty: true,
        textIsEmpty: true
    }
  },
  componentDidMount: function(){
    this.refs.author.focus();
  },
  handlerClick: function(event){
    event.preventDefault();
    var textEl = this.refs.text.value;
    var author = this.refs.author.value;
    var text = this.refs.text.value;

    var item = [{
      author: author,
      text: text,
      bigText: '...'
    }];

    window.ee.emit('News.add', item);

    textEl.value = '';
    this.setState({textIsEmpty: true})
  },
  onAuthorChange: function(event){
    if(event.target.value.trim() > 0){
      this.setState({
        authorIsEmpty: false
      })}else{
        this.setState({
          authorIsEmpty: true
        })
      }
    },
  onTextChange: function(event){
    if(event.target.value.trim() > 0){
      this.setState({
        textIsEmpty: false
      })}else{
        this.setState({
          textIsEmpty: true
        })
      }
    },
  onCheckRuleClick: function(event){
    this.setState({
      agreeNotChecked: !this.state.agreeNotChecked
    })
  },
  render: function(){
    return(
      <div className="form-wrapper ">
      <form className="add cf">
        <input
          type="text"
          ref="author"
          placeholder="Your Name"
          className="add-author"
          onChange={this.onAuthorChange}
        />
        <textarea
          className="add-text"
          placeholder="News text"
          ref="text"
          rows="5"
          onChange={this.onTextChange}
        />
        <label className="add-checkrule">
          <input type="checkbox"
            ref="checkrul"
            onChange={this.onCheckRuleClick}
          />
          I agree with the rules
        </label>
         <button
         className="add-btn"
         onClick={this.handlerClick}
         ref="alert_button"
         disabled={this.state.agreeNotChecked || this.state.onAuthorChange || this.state.onTextChange}>
         Add news
         </button>
      </form>
        </div>
   );
  }
});

var App = React.createClass({
  getInitialState: function(){
    return {
      news: my_news
    }
  },
  componentDidMount: function(){
      var self = this;
      window.ee.addListener('News.add', function(item){
        var nextNews = item.concat(self.state.news);
        self.setState({
          news: nextNews
        })
      })
  },
  componentWillUnmount: function(){
      window.ee.removeListener('News.add')
  },
  render: function(){
    return (
      <div className="app">
      <Add />
        <h3>NEWS!</h3>
      <News data={this.state.news} />
       </div>
    )
  }
});


ReactDOM.render(<App />,
                document.getElementById('root'));
