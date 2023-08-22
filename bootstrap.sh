source env.sh

# Create the resource group
az group create --name $MY_RESOURCE_GROUP --location "$LOC"

# Create a storage account
az storage account create --name $MY_STORAGE_ACCOUNT --location $LOC --resource-group $MY_RESOURCE_GROUP --sku Standard_LRS

# Create the function app with a consumption plan
az functionapp create --resource-group $MY_RESOURCE_GROUP --consumption-plan-location $LOC --runtime node --functions-version 3 --name $FUNCTION_APP_NAME --storage-account $MY_STORAGE_ACCOUNT

az functionapp config appsettings set --name <FUNCTION_APP_NAME>  --resource-group $MY_RESOURCE_GROUP  --settings AzureWebJobsFeatureFlags=EnableWorkerIndexing
