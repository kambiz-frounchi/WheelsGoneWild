DROP DATABASE IF EXISTS wheelsDB;

CREATE DATABASE wheelsDB;

USE wheelsDB;

CREATE TABLE bikes (
  id INT NOT NULL AUTO_INCREMENT,
  bikename VARCHAR(45) NULL,
  brand VARCHAR(45) NULL,
  category VARCHAR(45) NULL,
  color VARCHAR(45) NULL,
  framesize VARCHAR(45) NULL,
  framematerial VARCHAR(45) NULL,
  makeyear INTEGER(4) NULL,
  urlimage VARCHAR(1000) NULL,
  PRIMARY KEY (id)
);