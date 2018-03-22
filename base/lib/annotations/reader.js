/*
 * File: reader.js
 * Project: koa-app-starter
 * File Created: Monday, 19th March 2018 9:47:37 pm
 * Author: Aumard Jimmy <jimmy.aumard@gmail.com>
 * Author: Marc Roulias <marc@lampjunkie.com>
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:36:53 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

'use strict'

const StringScanner = require('StringScanner')

const Annotation = require('./annotation')
const AttributeParser = require('./attribute-parser')
const Parser = require('./parser')

/**
 * This class parses finds and returns information
 * about all annotations found in a given file path
 * based on annotations registered in the given registry.
 */
module.exports = class Reader {

  static get ES5() {
    return 1
  }

  static get ES6() {
    return 2
  }

  constructor(registry, globalContext) {
    this.registry = registry
    this.parser = new Parser()
    this.attributeParser = new AttributeParser(globalContext)

    this.annotationMap = {};
    this.annotationMap[Annotation.DEFINITION] = [];
    this.annotationMap[Annotation.CONSTRUCTOR] = [];
    this.annotationMap[Annotation.METHOD] = [];
    this.annotationMap[Annotation.PROPERTY] = [];

    this.definitionAnnotations = []
    this.constructorAnnotations = []
    this.methodAnnotations = []
    this.propertyAnnotations = []
  }

  parse(path) {

    this.parser = new Parser();

    // reset parsed annotations
    this.methodAnnotations = []
    this.constructorAnnotations = []
    this.propertyAnnotations = []
    this.definitionAnnotations = []

    this.createAnnotationMap()

    const metadata = this.parser.parseFile(path)

    if (metadata) {

      if (metadata.constructor) {
        this.constructorAnnotations = this.parseConstructorAnnotations(metadata.constructor.className, metadata.constructor.name, metadata.constructor.comment, path)
      }

      if (metadata.definition) {
        this.definitionAnnotations = this.parseDefinitionAnnotations(metadata.definition.name, metadata.definition.comment, path)
      }

      const methods = metadata.methods

      methods.forEach(function (methodMetadata) {
        const methodAnnotation = this.parseMethodAnnotations(methodMetadata.className, methodMetadata.name, methodMetadata.comment, path)
        this.methodAnnotations.push.apply(this.methodAnnotations, methodAnnotation)
      }.bind(this))

      const properties = metadata.properties

      properties.forEach(function (propertyMetadata) {
        const propertyAnnotation = this.parsePropertyAnnotations(propertyMetadata.className, propertyMetadata.name, propertyMetadata.comment, path)
        this.propertyAnnotations.push.apply(this.propertyAnnotations, propertyAnnotation)
      }.bind(this))

    }
  }

  parseAttributeAnnotations(annotationsToFind, attribute, filePath) {
    return this.parseAnnotations(null, null, attribute, annotationsToFind, filePath)
  }

  /**
   * Parse the constructor annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parseConstructorAnnotations(className, target, comment, filePath) {
    return this.parseAnnotations(className, target, comment, Annotation.CONSTRUCTOR, filePath)
  }

  /**
   * Parse the class definition annotations
   *
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parseDefinitionAnnotations(target, comment, filePath) {
    return this.parseAnnotations(null, target, comment, Annotation.DEFINITION, filePath)
  }

  /**
   * Parse the method annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parseMethodAnnotations(className, target, comment, filePath) {
    return this.parseAnnotations(className, target, comment, Annotation.METHOD, filePath)
  }

  /**
   * Parse the property annotations
   *
   * @param {String} className
   * @param {String} target
   * @param {String} comment
   * @param {String} filePath
   */
  parsePropertyAnnotations(className, target, comment, filePath) {
    return this.parseAnnotations(className, target, comment, Annotation.PROPERTY, filePath)
  }

  /**
   * Create the mapping of target types to annotation names
   * from the current Registry
   *
   * @returns {void}
   */
  createAnnotationMap() {

    const annotations = this.registry.annotations

    for (const i in annotations) {

      const annotationName = annotations[i].annotation || annotations[i].name
      const targets = annotations[i].targets

      targets.forEach(function (target) {
        this.annotationMap[target].push(annotationName);
      }.bind(this))
    }
  }

  /**
   * Parse the annotations found in a comment string into objects
   *
   * @param className
   * @param target
   * @param comment
   * @param type
   * @param filePath
   * @returns {Array}
   */
  parseAnnotations(className, target, comment, type, filePath) {

    const ss = new StringScanner(comment)

    const annotations = []

    let annotationsToFind = this.annotationMap[type];

    let annotation = null
    let parameters = null
    while (!ss.eos()) {

      annotation = null
      parameters = null

      // check if there are anymore annotations to find
      if (ss.scanUntil(/@/) === null) {
        break
      }

      // check if this is an annotation with parameters
      const annotationCheck = ss.checkUntil(/\(/)

      // went to a next line, so it doesn't have parameters
      if (annotationCheck === null || annotationCheck.match(/\n/)) {

        annotation = ss.scanUntil(/\n/)
        annotation = annotation.trim('\n')

        // has parameters
      } else {

        annotation = ss.scanUntil(/\(/)
        annotation = annotation.substring(0, annotation.length - 1)

        let done = false

        parameters = ''

        while (!done) {

          const scan = ss.scanUntil(/\)/g)

          if (scan === null) {
            done = true
          }
          else {

            parameters = parameters + scan

            const open = parameters.match(/\(/) === null ? 1 : parameters.match(/\(/g).length + 1
            const close = parameters.match(/\)/) === null ? 0 : parameters.match(/\)/g).length

            if (open === close) {
              done = true
            }
          }
        }

        parameters = parameters.substring(0, parameters.length - 1)
      }

      if (annotationsToFind.indexOf(annotation) >= 0) {

        let attributes = {}

        if (parameters !== null) {
          attributes = this.attributeParser.parse(this, annotationsToFind, parameters)
        }

        const AnnotationClass = this.registry.getAnnotationConstructor(annotation)
        const annotationObj = new AnnotationClass(attributes, filePath)

        if (className) {
          annotationObj.className = className
        }

        annotationObj.target = target
        annotationObj.type = type
        annotations.push(annotationObj)
      }
    }
    return annotations
  }
}
