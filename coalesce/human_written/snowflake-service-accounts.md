---
title: Setting Up a Snowflake Service Account for Coalesce
description: Learn how to create and configure a Snowflake service account with key pair authentication for connecting Coalesce to your non-development environments, ensuring pipeline continuity and stability.
keywords:
  - Snowflake
  - service account
  - key pair authentication
  - Coalesce
  - connection setup
  - data pipeline
  - environment configuration
  - RSA key
  - permissions
  - security
---

We recommend using a service account with key pair authentication in Snowflake to connect to your non-development Environments in Coalesce. This avoids linking Production or other shared Environments to an individual's account, which helps ensure your data pipeline's continuity and stability.

This guide walks you through the best practices for creating this service account.

## Create an RSA Public Key

We recommend authenticating the service account with key pair authentication. Authenticating with a username and password will be deprecated, and OAuth requires manual re-authorization that can interrupt your Production data pipelines. The following steps assume you've configured the service account for key pair authentication.

Follow the steps in the [Snowflake documentation][] for key pair authentication to generate your private and public keys. You'll need the public key in the next section.

## Provision the Service Account in Snowflake

Once you have the public key, you can assign it to the service account. The SQL code below creates a service account user and role. Feel free to edit the script to follow your organization's naming conventions.

```sql
-- Use a role with sufficient privileges to create roles and users (e.g., USERADMIN or SECURITYADMIN)
USE ROLE ACCOUNTADMIN; 

-- Define variables for easier customization
SET coalesce_role_name = 'COALESCE_SERVICE_ROLE';
SET coalesce_user_name = 'COALESCE_SERVICE_USER';
SET coalesce_warehouse_name = 'COALESCE_WH'; -- Replace with your chosen warehouse

-- Create the Coalesce role
CREATE ROLE IF NOT EXISTS IDENTIFIER($coalesce_role_name)
COMMENT = 'Dedicated role for Coalesce service account';

-- Create the Coalesce user with the public key
-- Replace '<YOUR_PUBLIC_KEY_STRING_HERE>' with the actual public key from rsa_key.pub (without headers/footers)
CREATE USER IF NOT EXISTS IDENTIFIER($coalesce_user_name)
RSA_PUBLIC_KEY = '<YOUR_PUBLIC_KEY_STRING_HERE>' 
DEFAULT_ROLE = IDENTIFIER($coalesce_role_name)
DEFAULT_WAREHOUSE = IDENTIFIER($coalesce_warehouse_name)
COMMENT = 'Service account user for Coalesce ETL/ELT operations';

-- Grant the COALESCE_ROLE to the COALESCE_USER
GRANT ROLE IDENTIFIER($coalesce_role_name) TO USER IDENTIFIER($coalesce_user_name);

-- Grant the COALESCE_ROLE to the SYSADMIN role (or another administrative role) 
-- This allows administrators to manage and troubleshoot the Coalesce setup.
GRANT ROLE IDENTIFIER($coalesce_role_name) TO ROLE SYSADMIN;
```

## Assign Permissions to the Service Account Role

After you create and assign the service account and role, you need to grant permissions. The role requires read permissions for all your source Storage Locations (the databases and schemas in Snowflake where your raw data is). It also needs read and write permissions for the target Storage Locations (the databases and schemas where you will write new objects).

```sql
-- Define variables for easier customization 
SET coalesce_role_name = 'COALESCE_SERVICE_ROLE'; 
SET coalesce_user_name = 'COALESCE_SERVICE_USER'; 
SET coalesce_warehouse_name = 'COALESCE_WH'; -- Replace with your chosen warehouse 
SET source_db_1 = 'RAW_DATA_DB'; -- Replace with your source database name 
SET source_schema_1 = 'SALES'; -- Replace with your source schema name 
SET dest_db_1 = 'ANALYTICS_DB'; -- Replace with your destination database name SET dest_schema_1 = 'REPORTING'; -- Replace with your destination schema name
-- ***Add additional Source/Target DBs/Schema variables as needed*** --

-- *** Step 2: Grant USAGE on Virtual Warehouse ***
USE ROLE ACCOUNTADMIN; -- Or a role that owns/manages warehouses

GRANT USAGE ON WAREHOUSE IDENTIFIER($coalesce_warehouse_name) TO ROLE IDENTIFIER($coalesce_role_name);

-- *** Step 3: Read Access to Source Databases/Schemas.  ***
-- Example for one source database/schema. Repeat for all relevant sources.
USE ROLE SYSADMIN; -- Or the owner role of the source DB

-- Source Database 1 (Repeat for all Sources)
GRANT USAGE ON DATABASE IDENTIFIER($source_db_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT USAGE ON SCHEMA IDENTIFIER($source_db_1).IDENTIFIER($source_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);

-- Grant SELECT on existing tables and views
GRANT SELECT ON ALL TABLES IN SCHEMA IDENTIFIER($source_db_1).IDENTIFIER($source_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT SELECT ON ALL VIEWS IN SCHEMA IDENTIFIER($source_db_1).IDENTIFIER($source_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);

-- Grant SELECT on FUTURE tables and views (CRUCIAL for new objects)
GRANT SELECT ON FUTURE TABLES IN SCHEMA IDENTIFIER($source_db_1).IDENTIFIER($source_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT SELECT ON FUTURE VIEWS IN SCHEMA IDENTIFIER($source_db_1).IDENTIFIER($source_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);

-- *** Step 4: Read/Write Access to Destination Databases/Schemas ***
-- Example for one destination database/schema. Repeat for all relevant destinations.
USE ROLE SYSADMIN; -- Or the owner role of the destination DB

-- Destination Database 1 (Repeat for all Target DBs/Schemas).
GRANT USAGE ON DATABASE IDENTIFIER($dest_db_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT USAGE ON SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);

-- Grants for creating objects
GRANT CREATE TABLE ON SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT CREATE VIEW ON SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT CREATE STAGE ON SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);

-- DML on existing objects
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT SELECT ON ALL VIEWS IN SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);

-- DML on FUTURE objects
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON FUTURE TABLES IN SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);
GRANT SELECT ON FUTURE VIEWS IN SCHEMA IDENTIFIER($dest_db_1).IDENTIFIER($dest_schema_1) TO ROLE IDENTIFIER($coalesce_role_name);

-- *** Step 5: Optional Global Privileges (Highly Recommended for Monitoring) ***
USE ROLE ACCOUNTADMIN; -- Global privileges require ACCOUNTADMIN

GRANT MONITOR EXECUTION ON ACCOUNT TO ROLE IDENTIFIER($coalesce_role_name);
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE IDENTIFIER($coalesce_role_name);
```

## Configure the Service Account in Coalesce Environments

Once you have the service account username and private key, enter them into the relevant Environments in Coalesce. For detailed instructions, refer to our documentation on how to [configure Environment settings][].

## Optional: Key Pair Rotation

Although key pair keys don't expire, we recommend rotating them periodically for security. Follow [Snowflake's key rotation guide][] to update your keys according to your organization's policies.

[Snowflake documentation]: https://docs.snowflake.com/en/user-guide/key-pair-auth#configuring-key-pair-authentication
[configure Environment settings]: https://docs.coalesce.io/docs/setup-your-project/connection-guides/snowflake/snowflake-key-pair-authentication
[Snowflake's key rotation guide]: https://docs.snowflake.com/en/user-guide/key-pair-auth#configuring-key-pair-rotation
