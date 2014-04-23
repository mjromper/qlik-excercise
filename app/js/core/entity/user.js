define(['app'],
  
function(app){

    app.factory('$user', ['$rootScope', function($rootScope){
        
        var User = {
          isLogged: false,
          username: null,
          firstName: null,
          lastName: null,
          email: null
        };

        User.setUserData = function(responseUserObj){
            var response = responseUserObj.user || responseUserObj;
            
            this.username = response['username'];
            this.firstName = response['first_name'];
            this.lastName = response['last_name'];
            this.email = response['email'];
                
            this.isLogged = true;
        };

        User.clearUserData = function(){
            this.username = null;
            this.firstName = null;
            this.lastName = null;
            this.email = null;
            
            this.isLogged = false;
        };

        User.getUserFirstname = function(){
            return (this.firstName)? this.firstName: 'nobody';
        };

        //Return 
        return User;
    }]);
});

