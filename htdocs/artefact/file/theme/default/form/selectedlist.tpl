<p id="{$prefix}_empty_selectlist"{if !empty($selectedlist)} class="hidden"{/if}>{str tag=nofilesfound section=artefact.file}</p>
<table id="{$prefix}_selectlist"  class="blogpost-attachments{if empty($selectedlist)} hidden{/if}">
 <thead>
  <tr>
   <th></th>
   <th>{str tag=Name section=artefact.file}</th>
   <th>{str tag=Description section=artefact.file}</th>
   <th>{str tag=tags}</th>
   <th></th>
  </tr>
 </thead>
 <tbody>
  {foreach from=$selectedlist item=file}
  <tr class="r{cycle values=0,1}">
    <td>
      <img src="{if $file->artefacttype == 'image'}{$WWWROOT}artefact/file/download.php?file={$file->id}&size=20x20{else}{$THEMEURL}images/{$file->artefacttype}.gif{/if}">
    </td>
    <td>{$file->title|str_shorten:34}</td>
    <td>{$file->description}</td>
    <td>{$file->tags}</td>
    <td>
       <button type="submit" class="button small unselect" name="unselect[{$file->id}]" value="{$file->id}">{str tag=remove}</button>
       <input type="hidden" name="selected[{$file->id}]" value="{$file->id}">
    </td>
  </tr>
  {/foreach}
 </tbody>
</table>
