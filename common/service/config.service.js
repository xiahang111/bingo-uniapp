let BASE_URL = ''
let WX_URL = ''


if (process.env.NODE_ENV == 'development') {
    BASE_URL = 'http://127.0.0.1:8501/' // 开发环境
	WX_URL = 'http://127.0.0.1:8506/'
} else {
	BASE_URL = 'http://boot.jeecg.org:8080/jeecg-boot' // 生产环境
	WX_URL = 'http://127.0.0.1:8506/'
}
let staticDomainURL = BASE_URL+ '/sys/common/static';

const configService = {
	apiUrl: BASE_URL,
	wxUrl: WX_URL,
	staticDomainURL: staticDomainURL
};

export default configService