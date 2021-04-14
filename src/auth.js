import * as config from './components/config';
import * as service from './services/posts';
import axios from 'axios';
const users = []

export function signIn({ email, password }) {

	axios.post(service.url+'/common/userAuth.do',{
		idUser: email,
		passWord: password
	})
	.then( response => { 
		
		if(response.data.code === "1"){
			config.login.session = response.data.result.JSESSIONID;
			config.user.id = response.data.result.idUser;
			config.user.name = response.data.result.nmUser;
			config.user.token2 = response.data.result.token2;
			users.push({email:response.data.result.idUser, password:"",name:response.data.result.nmUser});
			

			const user = users.find(user => user.email === email);

			
			return user;
		}else{
			alert("아이디 비밀번호를 확인하세요");

		}
	})


	
  //const user = users.find(user => user.email === email);
  //if (user === undefined) throw new Error();
  //config.user.id = user.email;
  //return user;
	return "a";
}

/*async f
			try {
				const response = await Promise.all([ 
					service.login(email,password)
				]);

				if(response[0].data.code === "1"){
					config.login.session = response[0].data.result.JSESSIONID;
					config.user.id = response[0].data.result.idUser;
					//user.email = config.user.id;
					users.push( { email: '10000'} );
					const user = users.find(user => user.email === email);

					return user;
				}else{
					//alert("아이디 비번 확인");
				}

			} catch(err){
				//alert("아이디 비번 확인");
			}
			return false;
/*
	var res;
	axios.post(service.url+'/common/userAuth.do',{
		idUser: email,
		passWord: password
	})
	.then( response => { 
		//console.log(response);
		if(response.data.code === "1"){
			config.login.session = response.data.result.JSESSIONID;
			config.user.id = response.data.result.idUser;
			//user.email = config.user.id;
			users.push( { email: '10000'} )
		
		}else{
			alert(response.data.message);
		}
	})
    .catch( response => { 
		
	});
	

  const user = users.find(user => user.email === email);
  
console.log(user);
  if (user === undefined) {
	  throw new Error();
  }

  return user;
*/