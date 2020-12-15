// const { axios } = require('aws-sdk');

console.log('sanity check');

var app = new Vue({
    el: '#main',
    data: {
        name: '',
        title: '',
        description: '',
        user: '',
        image: null,
        // seen: true,
        images: [],
        // myClassName: 'peter',
    },
    // mounted is a lifecycle method that we can access
    mounted: function () {
        console.log('Vue component mounted');
        var self = this;
        axios
            .get('/images')
            .then(function (res) {
                self.images = res.data;
            })
            .catch(function (error) {
                console.log('error at GET /', error);
            });
    },
    methods: {
        imageTitleMethod: function (image) {
            this.name = image;
        },
        handleFileChange: function (e) {
            console.log('e.target: ', e.target);
            this.image = e.target.files[0];
            console.log('app.image.name: ', app.image.name);
        },
        handleUpload: function (e) {
            e.preventDefault();
            console.log('click');
            // var self = this;
            var formData = new FormData();
            formData.append('title', this.title);
            formData.append('image', this.image);
            axios
                .post('/upload', formData)
                .then(console.log)
                .catch(function (error) {
                    console.log('error at GET /', error);
                });
        },
    },
});
