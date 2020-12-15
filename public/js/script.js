// const { axios } = require('aws-sdk');

console.log('sanity check');

var app = new Vue({
    el: '#main',
    data: {
        title: '',
        description: '',
        user: '',
        image: null,
        inputField: '',
        images: [],
    },
    // "mounted" lifecycle hook
    mounted: function () {
        console.log('Vue component mounted');
        var self = this;
        axios
            .get('/images')
            .then(function (res) {
                self.images = res.data; // data property holds body of response
            })
            .catch(function (error) {
                console.log('error at GET /', error);
            });
    },
    methods: {
        handleFileChange: function (e) {
            this.image = e.target.files[0];
            this.inputField = e.target.files[0].name;
        },
        handleUpload: function (e) {
            e.preventDefault();
            var self = this;
            var formData = new FormData();
            formData.append('title', this.title);
            formData.append('image', this.image);
            formData.append('user', this.user);
            formData.append('description', this.description);
            axios
                .post('/upload', formData)
                .then(function (res) {
                    self.images.unshift(res.data);
                })
                .catch(function (error) {
                    console.log('error in POST /upload', error);
                });
        },
    },
});
