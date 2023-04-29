# Ecommerce Backend (Challenge #13)

## About

This is an "ecommerce backend" app built with node, express, and sequelize that functions as a basic inventory management app. The intended user would be a manager or other staff interested in viewing, adding, updating, and removing products, categories, and tags from their inventory. 

## Demonstration

[Walkthrough/Demo Video](https://drive.google.com/file/d/1DKvrFTVyrDmQeIRjUsEznLzgg602-SrU/view?usp=share_link) 

## Installation and Use

This project was built with using the MySQL Shell in mind.

1. Download the repo
2. Navigate to the repo's root folder
3. Rename 'env.EXAMPLE' to 'env' and enter your mysql shell username and password. (Note: the ecommerce_db database uses 'root' for username and has no password.)
4. Start the mysql shell by typing `mysql -u root - p` in your terminal. 
5. Connect to the database by typing `SOURCE ./db/schema.sql`. 
6. Open another tab in your terminal. Type `npm run seed` to seed the database.
7. Start the server by typing `npm run start`. 
8. Interact with the database through the shell or through an app like [Insomnia](), as demonstrated in the walkthrough video above.

## Contributions

The following resources were used to develop and troubleshoot this project:

* [StackOverflow: 'Failed to open referenced table'](https://stackoverflow.com/questions/52377469/failed-to-open-the-referenced-table)
* [Sequelize Docs: Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
* [Sequelize Docs: Eager Loading](https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/)
* [Sequelize Docs: Model Basics](https://sequelize.org/docs/v6/core-concepts/model-basics/)
* [Sequelize Docs: Model Querying - Finders](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/)
* [Seqelize Docs: Validations & Constraints](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/)