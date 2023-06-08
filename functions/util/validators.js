const isEmpty = (string) => {
	if (string.trim() === '') return true;
	else return false;
};

export const validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const isEmail = (email) => {
	const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(emailRegEx)) return true;
	else return false;
};

export const validateCreateUserData = (data) => {
	let errors = {};

	if (isEmpty(data.email)) {
		errors.email = 'Must not be empty';
	} else if (!isEmail(data.email)) {
		errors.email = 'Must be valid email address';
	}
	
	if (isEmpty(data.name)) errors.name = 'Must not be empty';

	data.address.forEach(item => {
		if (isEmpty(item.street)) errors.street = 'Must not be empty';
		if (isEmpty(item.number)) errors.number = 'Must not be empty';
		if (isEmpty(item.cep)) errors.cep = 'Must not be empty';
		if (isEmpty(item.district)) errors.district = 'Must not be empty';
		if (isEmpty(item.city)) errors.city = 'Must not be empty';
		if (isEmpty(item.state)) errors.state = 'Must not be empty';
	});

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

