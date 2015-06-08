DROP TABLE IF EXISTS users_deployments;
DROP TABLE IF EXISTS google_users;
DROP TABLE IF EXISTS sensors_streams;
DROP TABLE IF EXISTS nodes_streams;
DROP TABLE IF EXISTS sensors;
DROP TABLE IF EXISTS streams;
DROP TABLE IF EXISTS nodes;
DROP TABLE IF EXISTS obstacles;
DROP TABLE IF EXISTS deployments;
DROP TABLE IF EXISTS hw_platforms;

CREATE TABLE google_users (
	id varchar(30) not null,
	name varchar(100) not null,
	email varchar(100) not null,
	picture_url varchar(200),
	PRIMARY KEY (id)
);

CREATE TABLE hw_platforms (
	id mediumint not null auto_increment,
	name varchar(30) not null,
	range_ double not null,
	rate double,
	voltage double,
	frequency double,
	ram double,
	flash double,
	energy double,
	rx double,
	cost double not null,
	PRIMARY KEY (id)
);

CREATE TABLE deployments (
	id mediumint not null auto_increment,
	name CHAR(50) not null,
	defnode mediumint not null,
	budget char(100) not null,
	budremain char(100) not null,
	budtype char(10) not null,
	step int not null,
	zoom int,
	centerlat varchar(20),
	centerlng varchar(20),
	type varchar(20),
	last_date datetime not null,
	last_used_by char(50) not null,
	PRIMARY KEY (id),
	FOREIGN KEY(defnode) REFERENCES hw_platforms(id)
	ON DELETE CASCADE
);

CREATE TABLE users_deployments (
	id_users char(50) not null,
	id_deployments mediumint not null,
	PRIMARY KEY (id_users, id_deployments),
	FOREIGN KEY (id_users) REFERENCES google_users(id),
	FOREIGN KEY (id_deployments) REFERENCES deployments(id)
	ON DELETE CASCADE
);

CREATE TABLE nodes (
	id mediumint not null,
	deployment mediumint not null,
	lat varchar(20) not null,
	lng varchar(20) not null,
	type_ mediumint not null,
	gateway int not null,
	PRIMARY KEY (id, deployment),
	FOREIGN KEY(type_) REFERENCES hw_platforms(id),
	FOREIGN KEY (deployment) REFERENCES deployments(id)
	ON DELETE CASCADE
);

CREATE TABLE obstacles (
	id mediumint not null,
	deployment mediumint not null,
	lat varchar(20) not null,
	lng varchar(20) not null,
	obs int not null,
	PRIMARY KEY (id, deployment),
	FOREIGN KEY (deployment) REFERENCES deployments(id)
	ON DELETE CASCADE
);

CREATE TABLE streams (
	id mediumint not null,
	id_dep mediumint not null,
	name CHAR(50) not null,
	PRIMARY KEY (id, id_dep)
);

CREATE TABLE nodes_streams (
	id_stream mediumint not null,
	id_node mediumint not null,
	id_dep mediumint not null,
	PRIMARY KEY (id_stream, id_node, id_dep),
	FOREIGN KEY (id_stream) REFERENCES streams(id),
	FOREIGN KEY (id_node, id_dep) REFERENCES nodes(id, deployment)
	ON DELETE CASCADE
);

CREATE TABLE sensors (
	id mediumint not null auto_increment,
	name_eng varchar(50) not null,
	name_spa varchar(50) not null,
	PRIMARY KEY (id)
);

CREATE TABLE sensors_streams (
	id_sensor mediumint not null,
	id_stream mediumint not null,
	id_dep mediumint not null,
	PRIMARY KEY (id_sensor, id_stream, id_dep),
	FOREIGN KEY (id_sensor) REFERENCES sensors(id),
	FOREIGN KEY (id_stream, id_dep) REFERENCES streams(id, id_dep)
	ON DELETE CASCADE
);

INSERT INTO sensors (name_eng, name_spa) VALUES
	('Pressure', 'Presión'),
	('Temperature', 'Temperatura'),
	('Light', 'Luz'),
	('Humidity', 'Humedad'),
	('Magnetic Field', 'Campo Magnético'),
	('GPS', 'GPS');

INSERT INTO hw_platforms (name, range_, rate, voltage, frequency, ram, flash, energy, rx, cost) VALUES
	('Mica', 60.96, 40, 3, 916, 4, 128, 31320, 3.8, 70),
	('Mica2', 152.4, 38.4, 3.3, 916, 4, 128, 31320, 9.6, 120),
	('Mica2dot', 152.4, 38.4, 3.3, 916, 4, 128, 31320, 9.6, 132),
	('MicaZ', 100, 150, 3.3, 2400, 4, 128, 31320, 19.7, 150),
	('TelosB', 100, 250, 3, 2400, 10, 48, 31320, 0, 220),
	('IRIS', 300, 250, 3.3, 2400, 8, 128, 31320, 0, 300),
	('Imote2', 30, 250, 4.5, 2400, 256, 32768, 52870, 0, 170),
	('ETRX2-DVKA', 150, 250, 3.6, 2400, 4, 128, 62640, 0, 270),
	('G-Node G301', 30, 500, 33, 916, 8, 256, 52870, 0, 190),
	('eko Plus', 450, -1, -1, 2400, -1, -1, 46980, 0, 210),
	('XYZ Node', 1, 250, 3.3, 2400, 32, 256, 46980, 0, 1),
	('TinyNode 584', 1, 152, 3, 868, 10, 48, 31320, 0, 1);