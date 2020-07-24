SELECT * FROM loadouts;

-- get stuff unpacked for demo
UPDATE `loadout_app`.`loadouts` SET `status` = '0' WHERE (
   `id` = '1ddda7b1-287d-4c23-b8de-6034a8772363' OR 
   `id` = '22a35a73-1b0c-4fd7-b4e3-bb5a35c927cc' OR 
   `id` = '3daed025-a1a2-4cf7-b98b-1164405b0fd2' OR 
   `id` = '861f2cd0-de08-49ce-93b7-0e8082eeb996' OR 
   `id` = 'b74f8b63-9a32-4155-911e-c71a67180c75' OR 
   `id` = 'e1ad5d4d-3a9f-47b5-b190-61e0a261daf0' OR 
   `id` = '1df9ff4c-5d1a-4f91-9322-3adeebc9ff29' OR 
   `id` = '37ac4506-4bd6-47f5-ad8e-a7a2b1d2d327' OR 
   `id` = '41b9bde9-4731-44d2-b471-d46d21aca680' OR 
   `id` = 'cb6aa74d-b0a7-4dd0-9222-cdb6d23cc432' OR 
   `id` = '97823f90-eeca-4d84-935f-eb0e95e3f9be' OR 
   `id` = '05b683c1-bfb0-427e-921c-7e6595e33729' OR 
   `id` = '663848bf-78c7-41bb-8ef6-ddc3cb7269f3' OR 
   `id` = '5155398c-7974-498a-a098-70bd63f8b207' OR 
   `id` = 'e109827f-4bfa-4384-9ac9-979776d2512b' OR 
   `id` = 'fb0cc10d-82de-40d9-86f8-34e182d8247d' OR 
   `id` = '6a8f82f7-8a52-497a-9f93-c92d0fc72b86');