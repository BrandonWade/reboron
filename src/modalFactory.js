var React = require('react');
var transitionEvents = require('domkit/transitionEvents');
var appendVendorPrefix = require('domkit/appendVendorPrefix');
var PropTypes = require('prop-types');

module.exports = function(animation){

 class Factory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            willHidden: false,
            hidden: true
        };

        this.hasHidden = this.hasHidden.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
        this.leave = this.leave.bind(this);
        this.enter = this.enter.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.toggle = this.toggle.bind(this);
        this.listenKeyboard = this.listenKeyboard.bind(this);
    };

    hasHidden() {
        return this.state.hidden;
    };

    addTransitionListener(node, handle){
        if (node) {
          var endListener = function(e) {
              if (e && e.target !== node) {
                  return;
              }
              transitionEvents.removeEndEventListener(node, endListener);
              handle();
          };
          transitionEvents.addEndEventListener(node, endListener);
        }
    };

    handleBackdropClick() {
        if (this.props.closeOnClick) {
            this.hide();
        }
    };

    render() {

        var hidden = this.hasHidden();
        if (hidden) return null;

        var willHidden = this.state.willHidden;
        var animation = this.props.animation;
        var modalStyle = animation.getModalStyle(willHidden);
        var backdropStyle = animation.getBackdropStyle(willHidden);
        var contentStyle = animation.getContentStyle(willHidden);
        var ref = animation.getRef(willHidden);
        var sharp = animation.getSharp && animation.getSharp(willHidden);

        // Apply custom style properties
        if (this.props.modalStyle) {
            var prefixedModalStyle = appendVendorPrefix(this.props.modalStyle);
            for (var style in prefixedModalStyle) {
                modalStyle[style] = prefixedModalStyle[style];
            }
        }

        if (this.props.backdropStyle) {
          var prefixedBackdropStyle = appendVendorPrefix(this.props.backdropStyle);
            for (var style in prefixedBackdropStyle) {
                backdropStyle[style] = prefixedBackdropStyle[style];
            }
        }

        if (this.props.contentStyle) {
          var prefixedContentStyle = appendVendorPrefix(this.props.contentStyle);
            for (var style in prefixedContentStyle) {
                contentStyle[style] = prefixedContentStyle[style];
            }
        }

        var backdrop = this.props.backdrop? React.createElement("div", {style: backdropStyle, onClick: this.props.closeOnClick? this.handleBackdropClick: null}): undefined;

        if(willHidden) {
            var node = this.refs[ref];
            this.addTransitionListener(node, this.leave);
        }

        return (React.createElement("span", null,
            React.createElement("div", {ref: "modal", style: modalStyle, className: this.props.className},
                sharp,
                React.createElement("div", {ref: "content", tabIndex: "-1", style: contentStyle},
                    this.props.children
                )
            ),
            backdrop
         ))
        ;
    };

    leave() {
        this.setState({
            hidden: true
        });
        this.props.onHide();
    };

    enter() {
        this.props.onShow();
    };

    show() {
        if (!this.hasHidden()) return;

        this.setState({
            willHidden: false,
            hidden: false
        });

        setTimeout(function(){
          var ref = this.props.animation.getRef();
          var node = this.refs[ref];
          this.addTransitionListener(node, this.enter);
        }.bind(this), 0);
    };

    hide() {
        if (this.hasHidden()) return;

        this.setState({
            willHidden: true
        });
    };

    toggle() {
        if (this.hasHidden())
            this.show();
        else
            this.hide();
    };

    listenKeyboard(event) {
        if (this.props.keyboard &&
                (event.key === "Escape" ||
                 event.keyCode === 27)) {
            this.hide();
        }
    };

    componentDidMount() {
        window.addEventListener("keydown", this.listenKeyboard, true);
    };

    componentWillUnmount()  {
        window.removeEventListener("keydown", this.listenKeyboard, true);
    };
};

Factory.propTypes = {
    className: PropTypes.string,
    // Close the modal when esc is pressed? Defaults to true.
    keyboard: PropTypes.bool,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    animation: PropTypes.object,
    backdrop: PropTypes.bool,
    closeOnClick: PropTypes.bool,
    modalStyle: PropTypes.object,
    backdropStyle: PropTypes.object,
    contentStyle: PropTypes.object
};

Factory.defaultProps = {
    className: "",
    onShow: function(){},
    onHide: function(){},
    animation: animation,
    keyboard: true,
    backdrop: true,
    closeOnClick: true,
    modalStyle: {},
    backdropStyle: {},
    contentStyle: {}
};

return Factory;
};