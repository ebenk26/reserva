angular.module('starter')  
           .controller('ItemController', ['$ionicFilterBar', ItemController])

function ItemController($ionicFilterBar) {  
    var vm = this,
        items = [],
        ratings = [],
        items2 = [],
        items3 = [],
        ratings2 = [],
        filterBarInstance;

        //sort rating asc
        for (var i = 1; i <= 3; i++) {
        var itemDate = moment().add(i, 'days');
        if (i==1) {
            var titles = 'Royal Salon';
            var src = 'img/salon1.png';
            var href = 'salon';
            var range = '1 km';
            var rating = 1;
        }else if (i==2) {
            var titles = 'Jewel Salon';
            var src = 'img/salon2.png';
            var href = '';
            var range = '2 km';
            var rating = 2;
        }else if (i==3) {
            var titles = 'Beauty Salon';
            var src = 'img/salon3.png';
            var href = '';
            var range = '3 km';
            var rating = 3;
        }else{
            var titles = 'Beauty Salon';
            var src = 'img/salon3.png';
            var href = '';
            var range = '1 km';
            var rating = 4;
        }
        var item = {
            // description: 'Description for item ' + i,
            title: titles,
            title2: 'Nine Inch Nails',
            src: src,
            href: href,
            range: range,
            rating: rating,
        };
        var rating = {
            rate: i,
            max: 5,
        };
        // console.log(item);
        items.push(item);
        ratings.push(rating);
    }

    //sort rating desc
    for (var i = 3; i >= 1; i--) {
        var itemDate = moment().add(i, 'days');
        if (i==1) {
            var titles = 'Royal Salon';
            var src = 'img/salon1.png';
            var href = 'app.salon';
            var range = '1 km';
            var rating = 1;
        }else if (i==2) {
            var titles = 'Jewel Salon';
            var src = 'img/salon2.png';
            var href = '';
            var range = '2 km';
            var rating = 2;
        }else if (i==3) {
            var titles = 'Beauty Salon';
            var src = 'img/salon3.png';
            var href = '';
            var range = '3 km';
            var rating = 3;
        }else{
            var titles = 'Beauty Salon';
            var src = 'img/salon3.png';
            var href = '';
            var range = '1 km';
            var rating = 4;
        }
        var item2 = {
            // description: 'Description for item ' + i,
            title: titles,
            title2: 'Nine Inch Nails',
            src: src,
            href: href,
            range: range,
            rating: rating,
        };
        var rating = {
            rate: i,
            max: 5,
        };
        // console.log(item2);
        items2.push(item2);
    }

    for (var i = 1; i <= 3; i++) {
        var itemDate = moment().add(i, 'days');
        if (i==1) {
            var titles = 'Royal Salon';
            var src = 'img/salon1.png';
            var href = 'app.salon';
            var range = '1 km';
            var rating = 1;
        }else if (i==2) {
            var titles = 'Jewel Salon';
            var src = 'img/salon2.png';
            var href = '';
            var range = '2 km';
            var rating = 2;
        }else if (i==3) {
            var titles = 'Beauty Salon';
            var src = 'img/salon3.png';
            var href = '';
            var range = '3 km';
            var rating = 3;
        }else{
            var titles = 'Beauty Salon';
            var src = 'img/salon3.png';
            var href = '';
            var range = '1 km';
            var rating = 4;
        }
        var item3 = {
            // description: 'Description for item ' + i,
            title: titles,
            title2: 'Nine Inch Nails',
            src: src,
            href: href,
            range: range,
            rating: rating,
        };
        var rating = {
            rate: i,
            max: 5,
        };
        // console.log(item);
        items3.push(item3);
    }

    vm.items = items;
    vm.ratings = rating;

    vm.items2 = items2;
    vm.items3 = items3;

    vm.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: vm.items,
        items2: vm.items2,
        items3: vm.items3,
        ratings: vm.rating,
        update: function (filteredItems) {
          vm.items = filteredItems;
          vm.items2 = filteredItems;
          vm.items3 = filteredItems;
        },
        filterProperties: 'title'
      });
      console.log('search click');
    };
    return vm;
}
