<?php
/**
 * Creative Commons License Block type for Mahara
 *
 * @package    mahara
 * @subpackage blocktype-creativecommons
 * @author     Francois Marier <francois@catalyst.net.nz>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL version 3 or later
 * @copyright  For copyright information on Mahara, please see the README file distributed with this software.
 *
 */

defined('INTERNAL') || die();

class PluginBlocktypeClippy extends PluginBlocktype {
	public static function get_title() {
		return get_string('title', 'blocktype.clippy');
	}
	
	public static function get_description() {
		return get_string('description', 'blocktype.clippy');
	} 
	
	public static function get_categories() {
		return array('general');
	}
	
	public static function hide_title_on_empty_content() {
		return true;
	}
	
	public static function render_instance(BlockInstance $instance, $editing=false) {
		if (!$editing) {
			return '';
		}
		else {
			$configdata = $instance->get('configdata');
			if (isset($configdata['agent'])) {
				$agent = $configdata['agent'];
			}
			else {
				$agent = 'Clippy';
			}
			$agentname = get_string("agentname{$agent}", 'blocktype.clippy');
			return get_string('youhaveselectedthisagent', 'blocktype.clippy', $agentname);
		}
	}
	
	public static function artefactchooser_element($default = null) {
		return false;
	}
	
	public static function single_only() {
		return true;
	}
	
	public static function get_instance_javascript(BlockInstance $bi) {
		$configdata = $bi->get('configdata');
		$agent = $configdata['agent'];
		// Make sure it's a legal array
		if (!array_key_exists($agent, self::available_agents())) {
			return array();
		}
		
		return array(
				array(
						'file'   => 'js/clippy/build/clippy.js',
						'initjs' => <<<JS
							clippy.load('$agent', function(agent){
								agent.show();
							});
JS
				)
		);
	}
	
	public static function has_instance_config() {
		return true;
	}
	
	public static function instance_config_form(BlockInstance $instance) {
		$configdata = $instance->get('configdata');
		return array(
				'agent' => array(
					'title' => 'Agent',
					'type' => 'select',
					'options' => self::available_agents(),
					'defaultvalue' => !empty($configdata['agent']) ? $configdata['agent'] : 'Clippy',
					'required' => true,
			)
		);
	}
	
	/**
	 * Returns a list of the available agents, and the lang strings for their names.
	 * The keys are the agents, the values are the lang names. The array will be in order
	 * by alphabetical order of the lang names
	 * 
	 * @return multitype:string
	 */
	public static function available_agents() {
		$agents = array(
			'Bonzi',
			'Clippy',
			'F1',
			'Genie',
			'Genius',
			'Links',
			'Merlin',
			'Peedy',
			'Rocky',
			'Rover',
		);
		$return = array();
		foreach($agents as $agent) {
			$return[$agent] = get_string("agentname{$agent}", 'blocktype.clippy');
		}
		asort($return);
		return $return;
	}
}
