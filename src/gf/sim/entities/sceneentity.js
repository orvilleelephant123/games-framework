/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('gf.sim.entities.SceneEntity');

goog.require('gf.log');
goog.require('gf.sim.Entity');
goog.require('gf.sim.EntityState');
goog.require('gf.sim.entities.SpatialEntity');



/**
 * Abstract entity that contains entites.
 * An entity that contains entities that may be spatially orientied, supplying
 * utilities useful for them.
 *
 * @constructor
 * @extends {gf.sim.Entity}
 * @param {!gf.sim.Simulator} simulator Owning simulator.
 * @param {!gf.sim.EntityFactory} entityFactory Entity factory.
 * @param {number} entityId Entity ID.
 * @param {number} entityFlags Bitmask of {@see gf.sim.EntityFlag} values.
 * @param {!gf.sim.search.SpatialDatabase} spatialDatabase Spatial database.
 */
gf.sim.entities.SceneEntity = function(
    simulator, entityFactory, entityId, entityFlags, spatialDatabase) {
  goog.base(this, simulator, entityFactory, entityId, entityFlags);

  /**
   * Spatial lookup database.
   * Children are added to this to enable fast lookups.
   * @private
   * @type {!gf.sim.search.SpatialDatabase}
   */
  this.spatialDatabase_ = spatialDatabase;
};
goog.inherits(gf.sim.entities.SceneEntity, gf.sim.Entity);


/**
 * Gets the spatial database used for spatial queries.
 * @return {!gf.sim.search.SpatialDatabase} Spatial database.
 */
gf.sim.entities.SceneEntity.prototype.getSpatialDatabase = function() {
  return this.spatialDatabase_;
};


/**
 * @override
 */
gf.sim.entities.SceneEntity.prototype.childAdded = function(entity) {
  if (entity instanceof gf.sim.entities.SpatialEntity) {
    gf.log.debug('spatial child added: ' + entity.getId());
    this.spatialDatabase_.addEntity(entity);
  }
};


/**
 * @override
 */
gf.sim.entities.SceneEntity.prototype.childRemoved = function(entity) {
  if (entity instanceof gf.sim.entities.SpatialEntity) {
    gf.log.debug('spatial child removed: ' + entity.getId());
    this.spatialDatabase_.removeEntity(entity);
  }
};


/**
 * Handles child spatial entities getting their transforms changed.
 * @param {!gf.sim.entities.SpatialEntity} entity Entity that changed.
 */
gf.sim.entities.SceneEntity.prototype.childTransformed = function(entity) {
  gf.log.debug('spatial child transformed: ' + entity.getId());
  this.spatialDatabase_.updateEntity(entity);
};



/**
 * Scene entity state.
 * @constructor
 * @extends {gf.sim.EntityState}
 * @param {!gf.sim.Entity} entity Entity that this object stores state for.
 * @param {!gf.sim.VariableTable} variableTable A subclass's variable table.
 */
gf.sim.entities.SceneEntity.State = function(entity, variableTable) {
  goog.base(this, entity, variableTable);
};
goog.inherits(gf.sim.entities.SceneEntity.State, gf.sim.EntityState);


/**
 * @override
 */
gf.sim.entities.SceneEntity.State.declareVariables = function(variableList) {
  gf.sim.EntityState.declareVariables(variableList);
};
