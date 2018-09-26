# OpenShift Web Console Extension

* Splunk Integration
* Custom Download Link

1. Deploy

    ```
    oc project openshift-web-console

    oc new-app https://github.com/openlab-red/ext-openshift-web-console --name=ext -lapp=ext --context-dir=/app

    oc patch dc ext -p '{
                     "spec": {
                         "template": {
                             "spec": {
                                 "nodeSelector": {
                                     "node-role.kubernetes.io/master": "true"
                                 }
                             }
                         }
                     }
                 }'
                 
    oc scale --replicas=3 dc/ext    
             
    oc create route edge --service=ext
    
    ```

2. Update openshift web console configmap

    ```
        oc project openshift-web-console
        oc apply -f config/webconsole-config.yaml
    ```

3. Rollout 

    ```
        oc delete pod -lapp=openshift-web-console
    ```
