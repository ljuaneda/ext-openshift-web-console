(function () {
    'use strict';

    angular.module("extension.splunk", ['openshiftConsole'])
        .run(function (extensionRegistry) {
            extensionRegistry.add('log-links', _.spread(function (resource) {
                return {
                    type: 'dom',
                    node: '<splunk-link pod="' + resource.metadata.name +
                        '" namespace="' + resource.metadata.namespace + '" />'
                };
            }));
        })
        .directive('splunkLink', SplunkLink);


    function SplunkLink() {

        var directive = {
            restrict: 'E',
            template: '<span>' +
                '   <span >' +
                '       <a href="{{ searchString }}" target="_blank">' +
                '           Splunk <i class="fa fa-external-link"></i>' +
                '       </a>' +
                '   </span>' +
                '   <span class="action-divider">|</span>' +
                '</span>',
            scope: {
                pod: '@',
                namespace: '@'
            },
            link: link
        };

        return directive;

        function link(scope, element, attributes) {
            //... it should exist a better approach to watch the container list....
            var _logViewerScope = scope.$parent.$parent.$parent;
            _logViewerScope.$watchGroup(['context.project.metadata.name', 'options.container', 'name'], function () {
                var container = _logViewerScope.options.container;
                scope.searchString = searchString(attributes, container);
            });
        }

        function searchString(attr, container) {
            var properties = window.OPENSHIFT_EXTENSION_PROPERTIES;

            return properties.splunkURL +
                properties.splunkQueryPrefix +
                addIndex(properties, attr.namespace) +
                ' namespace=' + attr.namespace +
                addContainerName(container) +
                ' pod=' + attr.pod;
        }

        function addContainerName(container) {
            if (container) {
                return ' container_name=' + container;
            }
            return '';
        }

        function addIndex(properties, namespace) {
            var index = '';
            if (properties.splunkApplicationIndex) {
                index = 'index=';
                if (properties.splunkSystemIndex && namespace.search(properties.splunkSystemNamespacePattern) >= 0) {
                    index += properties.splunkSystemIndex
                } else {
                    index += properties.splunkApplicationIndex;
                }
            }
            return index;
        }

    }

    hawtioPluginLoader.addModule("extension.splunk");

}());
