import * as React from 'react';
import ReCaptcha from 'react-google-recaptcha';

type ReCaptchaProps = {
    enableReCaptcha: boolean;
    onCaptchaChange: (value: any) => void;
};

export default class extends React.Component<ReCaptchaProps, {}> {
    constructor(props: any) {
        super(props);
    }
    recaptcha: any;

    public reloadCaptch() {
        this.recaptcha.reset();
    }

    public render() {
        return (
        this.props.enableReCaptcha
            ? <div className='re-captcha' style={{textAlign: '-webkit-right'}}>
                    <ReCaptcha
                        ref={(el: any) => this.recaptcha = el}
                        sitekey='6LetVVYUAAAAABen9j-qBWnPvT5E0l2cSoEsqkWX'
                        onChange={this.props.onCaptchaChange}
                    />
                </div>
            : <div />
        );
    }

}
