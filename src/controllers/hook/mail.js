import QBFK from 'QBFK'
import nodemailer from 'nodemailer'

module.exports = async function (opt,cb) {

    // -------------------------
    // business const
    // -------------------------
    var mailTransport = nodemailer.createTransport({
        host: 'smtp.exmail.qq.com',
        secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
        auth: {
            user: 'xiaolin@tuhu.cn',
            pass: '1qazXSW@'
        },
    });

    var subject = opt.env == 'production' ? `[生产环境][项目:${opt.project}]` : `[测试环境][项目:${opt.project}]`

    var options = {
        from: 'xiaolin@tuhu.cn',
        to: QBFK.config.dir.biz[opt.project].mail,
        // cc         : 'xiaolin@tuhu.cn',  //抄送
        bcc      : 'xiaolin@tuhu.cn',    //密送
        subject,
        // text: '一封来自Node Mailer的邮件',
        html: `<h1>你好，这是一封来自${subject}的邮件！请注意查收附件</h1><br>邮件发送时间：${new Date()}<br>预览地址：<a href="http://wx.dev.tuhu.work/vue/vueTest/pages/home/index?_project=${opt.project}">查看</a>`,
        attachments:
            [
                {
                    filename: opt.attachName,            // 改成你的附件名
                    path: opt.attachUrl,  // 改成你的附件路径
                }
            ]
    };

    mailTransport.sendMail(options, function (err, msg) {
        if (err) {
            console.log(err)
            // res.render('index', { title: err });
        }
        else {
            console.log(msg)
            cb && cb()
            // res.render('index', { title: "已接收：" + msg.accepted });
        }
    });
}